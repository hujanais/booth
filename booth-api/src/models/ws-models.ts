import { Socket } from "socket.io";
import { RoomModel } from "./room-model";
import { UserModel } from "./user-model";
import { MessageModel } from "./message-model";

export type Session = {
    sessionId: string,
    user: UserModel,
    socket: Socket | null,
    roomId: string | null
}

export enum ChangeType {
    RoomAdded = 'room_added',       // RoomChangedModel
    RoomDeleted = 'room_deleted',   // RoomChangedModel 
    RoomUpdated = 'room_updated',   // RoomUpdatedModel
    //    UserEntered = 'user_entered',   // UserEnterExitRoomModel
    //    UserExited = 'user_exited',     // UserEnterExitRoomModel
       NewMessage = 'new_message',     // MessageModel
}

export type RoomChangedModel = {
    room: RoomModel;
    rooms: RoomModel[];
}

export type RoomUpdatedModel = {
    id: string;
    owner: UserModel;
    users: UserModel[];
    title: string;
    description: string;
    messages: MessageModel[];
}