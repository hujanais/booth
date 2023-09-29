import { RoomModel } from "./room-model";

export enum ChangeType {
    RoomAdded = 'room_added',
    RoomDeleted = 'room_deleted',
    RoomUpdated = 'room updated',
}

export type ChangeModel<T extends RoomChangedModel | RoomUpdatedModel | UserChangedModel | MessageChangedModel> = {
    changeType: ChangeType;
    data: T;
}

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