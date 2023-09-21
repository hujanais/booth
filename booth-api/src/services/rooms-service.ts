import { RoomModel} from "../models/room-model";
import { v4 as uuidv4 } from 'uuid';

export class RoomService {

    private _rooms: RoomModel[] = [];

    public async getAllRooms(): Promise<RoomModel[]> {
        return this._rooms;
    }

    public async createRoom(room: RoomModel): Promise<RoomModel> {

        const newRoom: RoomModel = {
            id: uuidv4(),
            ownerId: room.ownerId,
            title: room.title,
            description: room.description
        };

        this._rooms.push(newRoom)

        return newRoom;
    }

    public async deleteRoom(userId: string, roomId: string): Promise<RoomModel> {
        const room = this._rooms.find(r => r.id === roomId);
        if (!room) throw new Error(`The room ${roomId} is not found`);

        if (room.ownerId !== userId) throw new Error ('Cannot delete a room that you are not the owner');

        this._rooms = this._rooms.filter(v => v.id !== roomId);
        return room;
    }
    
    public joinRoom() {}
    
    public updateRoom() {}

}