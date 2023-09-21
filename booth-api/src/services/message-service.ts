import { MessageModel } from "../models/message-model";
import { v4 as uuidv4 } from 'uuid';

export class MessageService {
    private messages: Map<string, MessageModel> = new Map<string, MessageModel>();

    public async postMessage(message: MessageModel) {
        const msgId = uuidv4();
        message.id = msgId;
        this.messages.set(msgId, message);
        return message;
    }

    public async updateMessage(message: MessageModel) {
        const msgId = message.id;
        if (!msgId) throw new Error('message id is missing');
        const foundMsg = this.messages.get(msgId);
        if (!foundMsg) throw new Error(`Message ${msgId} is not found`);

        this.messages.set(msgId, message);
        return foundMsg;
    }

    public async deleteMessage(message: MessageModel) {
        const msgId = message.id;
        if (!msgId) throw new Error('message id is missing');
        const foundMsg = this.messages.get(msgId);
        if (!foundMsg) throw new Error(`Message ${msgId} is not found`);

        this.messages.delete(msgId);

        return foundMsg;
        
    }
}