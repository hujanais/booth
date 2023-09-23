import { CreateMessageRequest, MessageModel, UpdateMessageRequest } from "../models/message-model";
import { v4 as uuidv4 } from 'uuid';
import _dbFactory from "../db/db-factory";

export class MessageService {

    public async postMessage(userId: string, payload: CreateMessageRequest) : Promise<MessageModel> {
        const room = _dbFactory.rooms.find(r => r.id === payload.roomId);
        if (!room) throw new Error('Cannot find the room to post-message');
        if (!room.users.find(uId => uId === userId)) throw new Error('User is not part of this room');

        const message: MessageModel = {
            id: uuidv4(),
            ownerId: userId,
            roomId: payload.roomId,
            message: payload.message,
        }

        room.messages.push(message);
        return message;
    }

    public async updateMessage(payload: UpdateMessageRequest) : Promise<MessageModel>{
        
        let foundMsg;
        for (let i = 0; i < _dbFactory.rooms.length; i++) {
            const room = _dbFactory.rooms[i];
            foundMsg = room.messages.find(m => m.id === payload.messageId);
            if (foundMsg) break;
        }

        if (!foundMsg) {
            throw new Error('The message to be updated is not found');
        }

        foundMsg.message = payload.message;
        return foundMsg;
    }

    public async deleteMessage(userId: string, messageId: string) : Promise<MessageModel> {
        for (let i = 0; i < _dbFactory.rooms.length; i++) {
            const room = _dbFactory.rooms[i];
            const idx = room.messages.findIndex(m => m.id === messageId);
            if (idx >= 0) {
                if (room.messages[idx].ownerId !== userId) {
                    throw new Error ('Cannot edit someone else\'s message');
                }
                
                const deletedMsg = {...room.messages[idx]};
                room.messages.splice(idx, 1);
                return deletedMsg;
            }
        }

        throw new Error('message was not found');
    }
}