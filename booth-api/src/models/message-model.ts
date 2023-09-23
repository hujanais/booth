export type MessageModel = {
    id: string;
    ownerId: string;
    roomId: string;
    message: string;
}

export type CreateMessageModelRequest = {
    roomId: string;
    message: string;
}

export type UpdateMessageModelRequest = { 
    userId: string;
    messageId: string;
    message: string;
}