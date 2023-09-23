import { MessageModel } from "./message-model";

export type RoomModel = {
    id?: string;
    ownerId: string;
    users: string[];
    title: string;
    description: string;
    messages: MessageModel[];
}

export type CreateRoomModelRequest = {
    ownerId: string;
    title: string;
    description: string;
}

export type UpdateRoomModelRequest = {
    roomId: string;
    title: string;
    description: string;
}

export type JoinRoomModelRequest = {
    roomId: string;
}