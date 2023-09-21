import { Request, Response } from "express";

import express from "express";
const router = express.Router();

import * as dotenv from "dotenv";
dotenv.config();

router.post('/room', async (req: Request, res: Response) => {
    const { body } = req;

    res.json({data: 'ok'});
})

router.get('/rooms', async (req: Request, res: Response) => {
    const { body } = req;

    res.json({data: 'rooms'});
})

export default router; 