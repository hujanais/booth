import { RoomModel } from "./room-model";

export type RoomChangedModel = {
    room: RoomModel;
    rooms: RoomModel[];
}

export type RoomUpdatedModel = {
    room: RoomModel;
}

export type UserChangedModel = {
    username: string;
    room: RoomModel;
}

export type MessageChangedModel = {
    roomId: string;
    messageId: string;
}