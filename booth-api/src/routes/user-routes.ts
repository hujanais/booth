import { Request, Response } from "express";
import { UserService } from "../services/user-service";

import express from "express";
import { LoginUserModelRequest } from "../models/user-model";
const router = express.Router();

const _userService = new UserService();

// login. POST /api/login
router.post('/login', async (req: Request, res: Response) => {
    const { body } = req;
    const payload: LoginUserModelRequest = body as LoginUserModelRequest;

    if (!payload || !payload.username || !payload.password) {
        res.status(401).send('Unauthorized');
    }

    try {
        const user = _userService.login(payload);
        res.json(user);
    } catch (err: any) {
        res.status(500).send(err.message);
    }
});

export default router; 