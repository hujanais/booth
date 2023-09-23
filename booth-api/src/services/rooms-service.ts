import { CreateRoomRequest, JoinRoomRequest, RoomModel, UpdateRoomRequest} from "../models/room-model";
import { v4 as uuidv4 } from 'uuid';
import _dbFactory from "../db/db-factory";

export class RoomService {

    public async getAllRooms(): Promise<RoomModel[]> {
        return _dbFactory.rooms;
    }

    public async createRoom(payload: CreateRoomRequest): Promise<RoomModel> {

        const newRoom: RoomModel = {
            id: uuidv4(),
            ownerId: payload.ownerId,
            title: payload.title,
            description: payload.description,
            users: [],
            messages: []
        };

        _dbFactory.rooms.push(newRoom);

        return newRoom;
    }

    public async deleteRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        if (room.ownerId !== userId) throw new Error ('Cannot delete a room that you are not the owner');

        const idx = _dbFactory.rooms.findIndex(r => r.id === roomId);
        if (idx >= 0) {
            _dbFactory.rooms.splice(idx, 1);
        }
        return room;
    }
    
    public async updateRoom(userId: string, room: UpdateRoomRequest): Promise<RoomModel> {
        const foundRoom = _dbFactory.rooms.find(r => r.id === room.roomId);
        if (!foundRoom) throw new Error(`The room ${room.roomId} is not found`);
        if (foundRoom.ownerId !== userId) throw new Error ('Cannot update a room that you are not the owner');

        foundRoom.title = room.title;
        foundRoom.description = room.description;

        return foundRoom;
    }

    public async joinRoom(userId: string, payload: JoinRoomRequest): Promise<RoomModel> {
        const room = _dbFactory.rooms.find(r => r.id === payload.roomId);
        if (!room) throw new Error(`The room ${payload.roomId} is not found`);

        if (!room.users.find(uId => uId === userId)) {
            room.users.push(userId);
        }

        return room;
    }

    public async exitRoom(userId: string, roomId: string): Promise<void> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);
        const idx = room.users.findIndex(uId => uId === userId);
        if (idx >= 0) {
            room.users.splice(idx, 1);
        }
    }
}