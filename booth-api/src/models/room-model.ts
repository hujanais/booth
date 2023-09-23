import { MessageModel } from "./message-model";

export type RoomModel = {
    id?: string;
    ownerId: string;
    users: string[];
    title: string;
    description: string;
    messages: MessageModel[];
}

export type CreateRoomRequest = {
    ownerId: string;
    title: string;
    description: string;
}

export type UpdateRoomRequest = {
    roomId: string;
    title: string;
    description: string;
}

export type JoinRoomRequest = {
    roomId: string;
}