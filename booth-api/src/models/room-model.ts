import { MessageModel } from "./message-model";
import { UserModel, UserSessionModel } from "./user-model";

export type RoomModel = {
    id: string;
    owner: UserModel;
    users: UserSessionModel[];
    title: string;
    description: string;
    messages: MessageModel[];
}

export type CreateRoomRequest = {
    title: string;
    description: string;
}

export type UpdateRoomRequest = {
    roomId: string;
    title: string;
    description: string;
}
