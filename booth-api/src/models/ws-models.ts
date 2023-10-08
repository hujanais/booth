import { Socket } from "socket.io";
import { RoomModel } from "./room-model";
import { UserModel } from "./user-model";

export type Session = {
    user: UserModel,
    socket: Socket | undefined
}

export enum ChangeType {
    RoomAdded = 'room_added',       // RoomChangedModel
    RoomDeleted = 'room_deleted',   // RoomChangedModel 
    RoomUpdated = 'room_updated',   // RoomUpdatedModel
    //    UserEntered = 'user_entered',   // UserEnterExitRoomModel
    //    UserExited = 'user_exited',     // UserEnterExitRoomModel
    //    NewMessage = 'new_message',     // MessageModel
}

export type RoomChangedModel = {
    room: RoomModel;
    rooms: RoomModel[];
}

export type RoomUpdatedModel = {
    room: RoomModel;
}