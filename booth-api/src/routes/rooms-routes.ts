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
    const sessionId = res.locals.sessionId;

    try {
        const resp = await roomService.joinRoom(sessionId, roomId);
        console.log(`${sessionId} has joined the room`);
        res.json(resp);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
});

// exit a room. DELETE /api/room/join/:roomId
router.delete('/room/join/:roomId', async (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const sessionId = res.locals.sessionId;

    try {
        const resp = await roomService.exitRoom(sessionId, roomId);
        console.log(`${sessionId} has exited the room`);
        res.json(resp);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
});

// Create a new room. POST /api/room
router.post('/room', async (req: Request, res: Response) => {
    const { body } = req;
    const sessionId = res.locals.sessionId;

    const payload = body as CreateRoomRequest;

    try {
        const resp = await roomService.createRoom(sessionId, payload);
        console.log(`${sessionId} has created a new room ${resp.id}`);
        res.json(resp);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
})

// Get all rooms.  GET /api/rooms
router.get('/rooms', async (req: Request, res: Response) => {
    try {
        const allRooms = await roomService.getAllRooms();   // return RoomUpdatedModel
        res.json(allRooms);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
})

// update the room. PUT /api/room --body UpdateRoomRequest
router.put('/room', async (req: Request, res: Response) => {
    const { body } = req;
    const sessionId = res.locals.sessionId;

    const updateRoom = body as UpdateRoomRequest;

    try {
        const resp = await roomService.updateRoom(sessionId, updateRoom);
        res.json(resp);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
})

// Delete a room. DELETE /api/room/roomId
router.delete('/room/:roomId', async (req: Request, res: Response) => {
    const sessionId = res.locals.sessionId;
    try {
        const roomId = req.params.roomId;
        const room = await roomService.deleteRoom(sessionId, roomId);
        console.log(`${sessionId} has deleted a room ${roomId}`);
        res.json(room);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
})

export default router; 