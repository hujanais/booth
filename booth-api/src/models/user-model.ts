export type InternalUserModel = {
    id: string;
    username: string;
    password: string;
}

export type UserModel = {
    id: string;
    socketId: string | null;
    username: string;
}

export type LoginUserRequest = {
    username: string;
    password: string;
}