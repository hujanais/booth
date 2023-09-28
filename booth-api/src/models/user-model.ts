export type InternalUserModel = {
    id: string;
    username: string;
    password: string;
}

export type UserModel = {
    id: string;
    username: string;
}

export type LoginUserRequest = { 
    username: string;
    password: string;
}