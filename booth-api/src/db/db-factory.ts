import { RoomModel } from "../models/room-model";

export class DBFactory {
    private _rooms: RoomModel[] = [];
    public get rooms(): RoomModel[] {
        return this._rooms;
    }
}
