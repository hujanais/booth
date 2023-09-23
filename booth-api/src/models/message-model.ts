export type MessageModel = {
    id: string;
    ownerId: string;
    roomId: string;
    message: string;
}

export type CreateMessageRequest = {
    roomId: string;
    message: string;
}

export type UpdateMessageRequest = { 
    userId: string;
    messageId: string;
    message: string;
}