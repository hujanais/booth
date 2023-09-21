import { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
dotenv.config();

import { RoomService } from '../services/rooms-service';
import { RoomModel } from "../models/room-model";
const roomService = new RoomService();

const USERID = uuidv4();

// Create a new room. POST /api/room
router.post('/room', async (req: Request, res: Response) => {
    const { body } = req;
    const newRoom: RoomModel = {
        ownerId: USERID,
        title: body.title,
        description: body.description
    };

    try {
        const resp = await roomService.createRoom(newRoom);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

// Get all rooms.  GET /api/rooms
router.get('/rooms', async (req: Request, res: Response) => {
    try {
        const allRooms = await roomService.getAllRooms();
        res.json(allRooms);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

// Delete a room. DELETE /api/room/roomId
router.delete('/room/:roomId', async (req: Request, res: Response) => {
    try {
        const roomId = req.params.roomId;
        const room = await roomService.deleteRoom(USERID, roomId);
        res.json(room);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

export default router; 