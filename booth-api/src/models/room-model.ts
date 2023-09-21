import { MessageModel } from "./message-model";

export type RoomModel = {
    id?: string;
    ownerId: string;
    users: string[];
    title: string;
    description: string;
    messages: MessageModel[];
}