import { RoomModel } from "./room-model";
import { UserModel } from "./user-model";

export enum ChangeType {
    RoomAdded = 'room_added',       // RoomChangedModel
    RoomDeleted = 'room_deleted',   // RoomChangedModel 
    RoomUpdated = 'room_updated',   // RoomUpdatedModel
    NewMessage = 'room_message'     // RoomUpdatedModel
}

export type RoomChangedModel = {
    room: RoomModel;
    rooms: RoomModel[];
}

export type RoomUpdatedModel = {
    room: RoomModel;
}

export type UserEnterExitRoomModel = {
    user: UserModel;
    room: RoomModel;
}

export type MessageChangedModel = {
    roomId: string;
    messageId: string;
}