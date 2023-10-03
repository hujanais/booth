import { CreateRoomRequest, RoomModel, UpdateRoomRequest } from "../models/room-model";
import { v4 as uuidv4 } from 'uuid';
import _dbFactory from "../db/db-factory";
import { UserEnterExitRoomModel } from "../models/ws-models";
import socketIo from "../websocket/socket_io";

export class RoomService {

    public async getAllRooms(): Promise<RoomModel[]> {
        return _dbFactory.rooms;
    }

    public async createRoom(userId: string, payload: CreateRoomRequest): Promise<RoomModel> {

        const user = _dbFactory.users.find(u => u.id === userId);
        if (!user) throw new Error('Sorry invalid userId');

        const newRoom: RoomModel = {
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

        _dbFactory.rooms.push(newRoom);

        socketIo.notifyRoomAdded(newRoom, _dbFactory.rooms);

        return newRoom;
    }

    public async deleteRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        if (room.owner.id !== userId) throw new Error('Cannot delete a room that you are not the owner');

        const idx = _dbFactory.rooms.findIndex(r => r.id === roomId);
        if (idx >= 0) {
            _dbFactory.rooms.splice(idx, 1);
        }

        socketIo.notifyRoomRemoved(room, _dbFactory.rooms);

        return room;
    }

    public async updateRoom(userId: string, room: UpdateRoomRequest): Promise<RoomModel> {
        const foundRoom = _dbFactory.rooms.find(r => r.id === room.roomId);
        if (!foundRoom) throw new Error(`The room ${room.roomId} is not found`);
        if (foundRoom.owner.id !== userId) throw new Error('Cannot update a room that you are not the owner');

        foundRoom.title = room.title;
        foundRoom.description = room.description;

        socketIo.notifyRoomChanged(foundRoom);

        return foundRoom;
    }

    public async joinRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const user = _dbFactory.users.find(user => user.id === userId);
        if (user) {
            if (room.users.find(p => p.id === user.id)) {
                // user already in the room.
                return room;
            }

            const notifyUserJoinedPayload: UserEnterExitRoomModel = {
                user: {
                    id: user.id,
                    username: user.username
                },
                room: { ...room }
            };
            socketIo.notifyUserJoined(notifyUserJoinedPayload);

            room.users.push({ id: user.id, username: user.username });
            socketIo.notifyRoomChanged(room);
        }

        return room;
    }

    public async exitRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const idx = room.users.findIndex(user => user.id === userId);
        if (idx >= 0) {
            const user = _dbFactory.users.find(user => user.id === userId);
            if (user) {
                const notifyUserLeftPayload: UserEnterExitRoomModel = {
                    user: {
                        id: user.id,
                        username: user.username
                    },
                    room: { ...room }
                };
                socketIo.notifyUserLeft(notifyUserLeftPayload);

                room.users.splice(idx, 1);
                socketIo.notifyRoomChanged(room);
            }
        }

        return room;
    }
}