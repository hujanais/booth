import { Socket } from "socket.io";

export type InternalUserModel = {
    id: string;
    username: string;
    password: string;
}

export type UserModel = {
    id: string;
    username: string;
}

export type UserSessionModel = UserModel & {
    sockets: Socket[]
};

export type LoginUserRequest = {
    username: string;
    password: string;
}