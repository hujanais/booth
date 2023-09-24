export type UserModel = {
    id: string;
    username: string;
    password: string;
}

export type LoginUserRequest = { 
    username: string;
    password: string;
}