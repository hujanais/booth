import { Request, Response } from "express";

import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
dotenv.config();

import { RoomService } from '../services/rooms-service';
import { CreateRoomRequest, UpdateRoomRequest } from "../models/room-model";
const roomService = new RoomService();

// Join a room.  POST /api/room/join/:roomId
router.post('/room/join/:roomId', async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const { userId } = res.locals.userId;

    try {
        const resp = await roomService.joinRoom(userId, roomId);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
});

// Create a new room. POST /api/room
router.post('/room', async (req: Request, res: Response) => {
    const { body } = req;
    const { userId } = res.locals.userId;

    const payload = body as CreateRoomRequest;

    try {
        const resp = await roomService.createRoom(userId, payload);
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

// update the room. PUT /api/room --body UpdateRoomRequest
router.put('/room', async (req: Request, res: Response) => {
    const { body } = req;
    const { userId } = res.locals.userId;

    const updateRoom = body as UpdateRoomRequest;

    try {
        const resp = await roomService.updateRoom(userId, updateRoom);
        res.json(resp);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

// Delete a room. DELETE /api/room/roomId
router.delete('/room/:roomId', async (req: Request, res: Response) => {
    const { userId } = res.locals.userId;
    try {
        const roomId = req.params.roomId;
        const room = await roomService.deleteRoom(userId, roomId);
        res.json(room);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

export default router; 