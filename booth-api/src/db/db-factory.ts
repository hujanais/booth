import { RoomModel } from "../models/room-model";
import { InternalUserModel, UserModel } from "../models/user-model";

class DBFactory {
    private _users: InternalUserModel[] = [
        {
            id: '11111',    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjExMTExIiwiaWF0IjoxNjk1NDA1MDYyfQ.41Y2fsAm4kAIv061fGjaaDZ-InVdQpaGqbXhcm1Be4o
            username: 'satu',
            password: 'password'
        }
    ]

    private _rooms: RoomModel[] = [];
    public get rooms(): RoomModel[] {
        return this._rooms;
    }

    public get users(): InternalUserModel[] {
        return this._users;
    }
}

export default new DBFactory();
