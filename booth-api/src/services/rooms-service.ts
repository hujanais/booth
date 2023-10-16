import { CreateRoomRequest, RoomModel, UpdateRoomRequest } from "../models/room-model";
import { v4 as uuidv4 } from 'uuid';
import dbFactory from "../db/db-factory";
import socketIo from "../websocket/socket_io";
import { RoomUpdatedModel } from "../models/ws-models";

export class RoomService {

    public async getAllRooms(): Promise<RoomModel[]> {
        return dbFactory.rooms;
    }

    public async createRoom(sessionId: string, payload: CreateRoomRequest): Promise<RoomUpdatedModel> {

        const session = dbFactory.getSessionById(sessionId);
        const user = session?.user;
        if (!user) throw new Error('Sorry invalid userId');

        const room: RoomModel = {
            id: uuidv4(),
            owner: {
                id: user.id,
                username: user.username
            },
            title: payload.title,
            description: payload.description,
            users: [],
            messages: []
        };

        dbFactory.rooms.push(room);
        socketIo.notifyRoomAdded(room, dbFactory.rooms);

        const response: RoomUpdatedModel = {
            id: room.id,
            owner: {...room.owner},
            users: room.users.map(u => {
                return {
                    id: u.id,
                    username: u.username
                }
            }),
            title: room.title,
            description: room.description,
            messages: [...room.messages]
        }

        return response;
    }

    public async deleteRoom(sessionId: string, roomId: string): Promise<RoomUpdatedModel> {
        const room = dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const session = dbFactory.getSessionById(sessionId);
        if (room.owner.id !== session?.user.id) throw new Error('Cannot delete a room that you are not the owner');

        const idx = dbFactory.rooms.findIndex(r => r.id === roomId);
        if (idx >= 0) {
            dbFactory.rooms.splice(idx, 1);
        }

        socketIo.notifyRoomRemoved(room, dbFactory.rooms);

        const response: RoomUpdatedModel = {
            id: room.id,
            owner: {...room.owner},
            users: room.users.map(u => {
                return {
                    id: u.id,
                    username: u.username
                }
            }),
            title: room.title,
            description: room.description,
            messages: [...room.messages]
        }

        return response;
    }

    public async updateRoom(sessionId: string, room: UpdateRoomRequest): Promise<RoomUpdatedModel> {
        const foundRoom = dbFactory.rooms.find(r => r.id === room.roomId);
        const session = dbFactory.getSessionById(sessionId);
        const user = session?.user;
        if (!foundRoom) throw new Error(`The room ${room.roomId} is not found`);
        if (foundRoom.owner.id !== user?.id) throw new Error('Cannot update a room that you are not the owner');

        foundRoom.title = room.title;
        foundRoom.description = room.description;

        socketIo.notifyRoomChanged(foundRoom);
        socketIo.notifyNewMessage(foundRoom);

        const response: RoomUpdatedModel = {
            id: foundRoom.id,
            owner: {...foundRoom.owner},
            users: foundRoom.users.map(u => {
                return {
                    id: u.id,
                    username: u.username
                }
            }),
            title: foundRoom.title,
            description: foundRoom.description,
            messages: [...foundRoom.messages]
        }

        return response;
    }

    public async joinRoom(sessionId: string, roomId: string): Promise<RoomUpdatedModel> {
        const room = dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);
        const session = dbFactory.getSessionById(sessionId);
        const user = session?.user;
        if (!user) {
            throw new Error('joinRoom failed.  invalid sessionId');
        }

        const connectedSession = room.users.find(u => u.sockets.map(s => s.id).find(sId => sId === sessionId));
        if (connectedSession) {
            // user already in the room but this is a new session.
            return room;
        }

        const connectedUser = room.users.find(u => u.id === user.id);
        if (!connectedUser)  {
            room.users.push({
                id: user.id,
                username: user.username,
                sockets: [session.socket!]
            });
        } else {
            connectedUser.sockets.push(session.socket!);
        }

        room.messages.push({
            id: uuidv4(),
            owner: {
                id: user.id,
                username: user.username
            },
            roomId: room.id!,
            message: `${user.username} has joined.`,
            timestamp: Date.now().valueOf()
        });

        socketIo.notifyRoomChanged(room);
        socketIo.notifyNewMessage(room);

        const response: RoomUpdatedModel = {
            id: room.id,
            owner: {...room.owner},
            users: room.users.map(u => {
                return {
                    id: u.id,
                    username: u.username
                }
            }),
            title: room.title,
            description: room.description,
            messages: [...room.messages]
        }

        return response;
    }

    public async exitRoom(sessionId: string, roomId: string): Promise<RoomUpdatedModel> {
        const room = dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const session = dbFactory.getSessionById(sessionId);
        if(!session) throw new Error('exit room failed because sessionId is invalid');
        const socketId = session.socket?.id;        

        // get the user that exited.
        const userIdx = room.users.findIndex(u => u.id === session.user.id);
        if (userIdx < 0) throw new Error('exit room failed because user not found');

        const socketIdx = room.users[userIdx].sockets.findIndex(s => s.id === socketId);
        if (socketIdx >= 0) {
            const user = room.users[userIdx];
            room.messages.push({
                id: uuidv4(),
                owner: {
                    id: user.id,
                    username: user.username
                },
                roomId: room.id!,
                message: `${user.username} has exited.`,
                timestamp: Date.now().valueOf()
            });

            user.sockets.splice(socketIdx, 1);
            if (user.sockets.length === 0) {
                room.users.splice(userIdx, 1);
            }

            socketIo.notifyRoomChanged(room);
            socketIo.notifyNewMessage(room);
        }

        const response: RoomUpdatedModel = {
            id: room.id,
            owner: {...room.owner},
            users: room.users.map(u => {
                return {
                    id: u.id,
                    username: u.username
                }
            }),
            title: room.title,
            description: room.description,
            messages: [...room.messages]
        }

        return response;
    }
}