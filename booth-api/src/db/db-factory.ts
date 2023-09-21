import { RoomModel } from "../models/room-model";
import { UserModel } from "../models/user-model";

class DBFactory {
    private _rooms: RoomModel[] = [];
    private _users: UserModel[] = [];
}

export default new DBFactory;

