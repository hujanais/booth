import { CreateRoomRequest, RoomModel, UpdateRoomRequest } from "../models/room-model";
import { v4 as uuidv4 } from 'uuid';
import dbFactory from "../db/db-factory";
import socketIo from "../websocket/socket_io";

export class RoomService {

    public async getAllRooms(): Promise<RoomModel[]> {
        return dbFactory.rooms;
    }

    public async createRoom(userId: string, payload: CreateRoomRequest): Promise<RoomModel> {

        const user = dbFactory.getUserById(userId);
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

        dbFactory.rooms.push(newRoom);

        socketIo.notifyRoomAdded(newRoom, dbFactory.rooms);

        return newRoom;
    }

    public async deleteRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        if (room.owner.id !== userId) throw new Error('Cannot delete a room that you are not the owner');

        const idx = dbFactory.rooms.findIndex(r => r.id === roomId);
        if (idx >= 0) {
            dbFactory.rooms.splice(idx, 1);
        }

        socketIo.notifyRoomRemoved(room, dbFactory.rooms);

        return room;
    }

    public async updateRoom(userId: string, room: UpdateRoomRequest): Promise<RoomModel> {
        const foundRoom = dbFactory.rooms.find(r => r.id === room.roomId);
        if (!foundRoom) throw new Error(`The room ${room.roomId} is not found`);
        if (foundRoom.owner.id !== userId) throw new Error('Cannot update a room that you are not the owner');

        foundRoom.title = room.title;
        foundRoom.description = room.description;

        socketIo.notifyRoomChanged(foundRoom);

        return foundRoom;
    }

    public async joinRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const user = dbFactory.getUserById(userId);
        if (user) {
            if (room.users.find(p => p.id === user.id)) {
                // user already in the room.
                return room;
            }
            room.users.push({ id: user.id, username: user.username });
            socketIo.notifyRoomChanged(room);
        }

        return room;
    }

    public async exitRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const idx = room.users.findIndex(user => user.id === userId);
        if (idx >= 0) {
            const user = dbFactory.getUserById(userId);
            if (user) {
                room.users.splice(idx, 1);
                socketIo.notifyRoomChanged(room);
            }
        }

        return room;
    }
}