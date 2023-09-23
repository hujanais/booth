export type UserModel = {
    id: string;
    username: string;
    password: string;
}

export type LoginUserModelRequest = { 
    username: string;
    password: string;
}