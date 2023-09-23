import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
import { MessageService } from "../services/message-service";
import { CreateMessageModelRequest, MessageModel, UpdateMessageModelRequest } from "../models/message-model";
dotenv.config();

const messageService = new MessageService();

const USERID = uuidv4();

// Create a new room. POST /api/message
router.post('/message', async (req: Request, res: Response) => {
    const { body } = req;
    const { userId } = res.locals.userId;
    const payload = body as CreateMessageModelRequest;

    try {
        const resp = await messageService.postMessage(userId, payload);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

// Update an existing message.  PUT /api/message --body {message: ''}
router.put('/message/:msgId', async (req: Request, res: Response) => {
    const { userId } = res.locals.userId;
    const { body } = req;
    const payload: UpdateMessageModelRequest = body as UpdateMessageModelRequest;
    payload.userId = userId;

    try {
        const resp = await messageService.updateMessage(payload);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    } 
})

router.delete('/message/:msgId', async (req:Request, res: Response) => {
    const {userId} = res.locals.userId;
    const msgId = req.params.msgId;
    try {
        const resp = await messageService.deleteMessage(userId, msgId);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

export default router; 