import { CreateRoomRequest, RoomModel, UpdateRoomRequest } from "../models/room-model";
import { v4 as uuidv4 } from 'uuid';
import dbFactory from "../db/db-factory";
import socketIo from "../websocket/socket_io";

export class RoomService {

    public async getAllRooms(): Promise<RoomModel[]> {
        return dbFactory.getAllRooms();
    }

    public async createRoom(sessionId: string, payload: CreateRoomRequest): Promise<RoomModel> {

        const session = dbFactory.getSessionById(sessionId);
        const user = await dbFactory.getUserById(session?.userId!);
        if (!user) throw new Error('Sorry invalid userId');

        const newRoom: RoomModel = {
            id: uuidv4(),
            owner: {
                id: user.id,
                socketId: sessionId,
                username: user.username
            },
            title: payload.title,
            description: payload.description,
            users: [],
            messages: []
        };

        await dbFactory.addRoom(newRoom);
        const allRooms: RoomModel[] = await dbFactory.getAllRooms();
        socketIo.notifyRoomAdded(newRoom, allRooms);

        return newRoom;
    }

    public async deleteRoom(sessionId: string, roomId: string): Promise<RoomModel> {
        const room = (await dbFactory.getAllRooms()).find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const session = dbFactory.getSessionById(sessionId);
        if (room.owner.id !== session?.userId) throw new Error('Cannot delete a room that you are not the owner');

        await dbFactory.deleteRoom(roomId);
        const allRooms: RoomModel[] = await dbFactory.getAllRooms();
        socketIo.notifyRoomRemoved(room, allRooms);

        return room;
    }

    public async updateRoom(sessionId: string, room: UpdateRoomRequest): Promise<RoomModel> {
        const foundRoom = (await dbFactory.getAllRooms()).find(r => r.id === room.roomId);
        const session = dbFactory.getSessionById(sessionId);
        const user = await dbFactory.getUserById(session?.userId!);
        if (!foundRoom) throw new Error(`The room ${room.roomId} is not found`);
        if (foundRoom.owner.id !== user?.id) throw new Error('Cannot update a room that you are not the owner');

        foundRoom.title = room.title;
        foundRoom.description = room.description;

        socketIo.notifyRoomChanged(foundRoom);
        socketIo.notifyNewMessage(foundRoom);

        return foundRoom;
    }

    public async joinRoom(sessionId: string, roomId: string): Promise<RoomModel> {
        const room = (await dbFactory.getAllRooms()).find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);
        const session = dbFactory.getSessionById(sessionId);
        const user = await dbFactory.getUserById(session?.userId!);
        if (!user) {
            throw new Error('joinRoom failed.  invalid sessionId');
        }

        if (room.users.find(p => p.socketId === sessionId)) {
            // user already in the room but this is a new session.
            return room;
        }

        room.users.push({ id: user.id, username: user.username, socketId: sessionId });
        room.messages.push({
            id: uuidv4(),
            owner: {
                id: user.id,
                socketId: sessionId,
                username: user.username
            },
            roomId: room.id!,
            message: `${user.username} has joined.`,
            timestamp: Date.now().valueOf()
        });

        socketIo.notifyRoomChanged(room);
        socketIo.notifyNewMessage(room);

        return room;
    }

    public async exitRoom(sessionId: string, roomId: string): Promise<RoomModel> {
        const room = (await dbFactory.getAllRooms()).find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        if (!room.users.find(u => u.socketId === sessionId)) {
            throw new Error('exitRoom failed because sessionId is invalid');
        }

        const idx = room.users.findIndex(u => u.socketId === sessionId);
        if (idx >= 0) {
            const user = room.users[idx];
            room.messages.push({
                id: uuidv4(),
                owner: {
                    id: user.id,
                    socketId: sessionId,
                    username: user.username
                },
                roomId: room.id!,
                message: `${user.username} has exited.`,
                timestamp: Date.now().valueOf()
            });

            room.users.splice(idx, 1);
            socketIo.notifyRoomChanged(room);
            socketIo.notifyNewMessage(room);

        }

        return room;
    }
}