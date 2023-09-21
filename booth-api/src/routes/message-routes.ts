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

// Create a new room. POST /api/room
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

export default router; 