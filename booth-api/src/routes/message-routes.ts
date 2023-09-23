import { Request, Response } from "express";

import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
import { MessageService } from "../services/message-service";
import { CreateMessageRequest, UpdateMessageRequest } from "../models/message-model";
dotenv.config();

const messageService = new MessageService();

// Create a new room. POST /api/message
router.post('/message', async (req: Request, res: Response) => {
    const { body } = req;
    const { userId } = res.locals.userId;
    const payload = body as CreateMessageRequest;

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
    const payload: UpdateMessageRequest = body as UpdateMessageRequest;
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