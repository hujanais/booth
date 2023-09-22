import { RoomModel } from "../models/room-model";

class DBFactory {
    private _rooms: RoomModel[] = [];
    public get rooms(): RoomModel[] {
        return this._rooms;
    }
}

export default new DBFactory();
