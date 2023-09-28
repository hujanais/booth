import { CreateRoomRequest, RoomModel, UpdateRoomRequest} from "../models/room-model";
import { v4 as uuidv4 } from 'uuid';
import _dbFactory from "../db/db-factory";
import wssService from '../websocket/wss';

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

        wssService.notifyRoomAdded(newRoom, _dbFactory.rooms);

        return newRoom;
    }

    public async deleteRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        if (room.owner.id !== userId) throw new Error ('Cannot delete a room that you are not the owner');

        const idx = _dbFactory.rooms.findIndex(r => r.id === roomId);
        if (idx >= 0) {
            _dbFactory.rooms.splice(idx, 1);
        }

        wssService.notifyRoomAdded(room, _dbFactory.rooms);

        return room;
    }
    
    public async updateRoom(userId: string, room: UpdateRoomRequest): Promise<RoomModel> {
        const foundRoom = _dbFactory.rooms.find(r => r.id === room.roomId);
        if (!foundRoom) throw new Error(`The room ${room.roomId} is not found`);
        if (foundRoom.owner.id !== userId) throw new Error ('Cannot update a room that you are not the owner');

        foundRoom.title = room.title;
        foundRoom.description = room.description;

        wssService.notifyRoomChanged(foundRoom);

        return foundRoom;
    }

    public async joinRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const user = _dbFactory.users.find(user => user.id === userId);
        if (user) {
            room.users.push({id: user.id, username: user.username});
            wssService.notifyUserJoined(user.username, room);
        }

        return room;
    }

    public async exitRoom(userId: string, roomId: string): Promise<void> {
        const room = _dbFactory.rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        const idx = room.users.findIndex(user => user.id === userId);
        if (idx >= 0) {
            room.users.splice(idx, 1);

            const user = _dbFactory.users.find(user => user.id === userId);
            if (user) {
                wssService.notifyUserLeft(user.username, room);
            }
        }
    }
}