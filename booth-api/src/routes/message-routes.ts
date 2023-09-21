import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
import { MessageService } from "../services/message-service";
import { MessageModel } from "../models/message-model";
dotenv.config();

const messageService = new MessageService();

const USERID = uuidv4();

// Create a new room. POST /api/message
router.post('/message', async (req: Request, res: Response) => {
    const { body } = req;
    const newMessage: MessageModel = {
        ownerId: USERID,
        roomId: body.roomId,
        message: body.message
    };

    try {
        const resp = await messageService.postMessage(newMessage);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

// Update an existing message.  PUT /api/message --body {message: ''}
router.put('/message/:msgId', async (req: Request, res: Response) => {
    const msgId = req.params.msgId;
    const { body } = req;
    const message: MessageModel = {
        id: msgId,
        ownerId: USERID,
        roomId: 'not-needed',
        message: body.message
    }
    
    try {
        const resp = await messageService.updateMessage(message);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    } 
})

router.delete('/message/:msgId', async (req:Request, res: Response) => {
    const msgId = req.params.msgId;
    const message: MessageModel = {
        id: msgId,
        ownerId: USERID,
        roomId: 'not-needed',
        message: 'not-needed'
    }
    try {
        const resp = await messageService.deleteMessage(message);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

export default router; 