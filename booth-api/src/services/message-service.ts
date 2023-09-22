import { MessageModel } from "../models/message-model";
import { v4 as uuidv4 } from 'uuid';
import _dbFactory from "../db/db-factory";

export class MessageService {

    public async postMessage(message: MessageModel) : Promise<MessageModel> {
        const room = _dbFactory.rooms.find(r => r.id === message.roomId);
        if (!room) throw new Error('Cannot find the room to post-message');
        if (!room.users.find(uId => uId === message.ownerId)) throw new Error('User is not part of this room');

        message.id = uuidv4();
        room.messages.push(message);
        return message;
    }

    public async updateMessage(message: MessageModel) : Promise<MessageModel>{
        const room = _dbFactory.rooms.find(r => r.id === message.roomId) ;
        if (!room) throw new Error('Cannot find the room to update-message');
        if (!room.users.find(uId => uId === message.ownerId)) throw new Error('User is not part of this room');

        const existingMsg = room.messages.find(m => m.id === message.id);
        if (!existingMsg) throw new Error('The message to be updated is not found');

        if(existingMsg.ownerId !== message.ownerId) throw new Error ('Cannot edit someone else\'s message');

        existingMsg.message = message.message;
        return existingMsg;
    }

    public async deleteMessage(message: MessageModel) : Promise<MessageModel> {
        const room = _dbFactory.rooms.find(r => r.id === message.roomId);
        if (!room) throw new Error('Cannot find the room to delete-message');
        
        const idx = room.messages.findIndex(m => m.id === message.id);
        if (idx < 0) throw new Error('The message to be deleted is not found');
        const existingMsg = room.messages[idx];
        if(existingMsg.ownerId !== message.ownerId) throw new Error ('Cannot edit someone else\'s message');

        room.messages.splice(idx, 1);

        return existingMsg;       
    }
}