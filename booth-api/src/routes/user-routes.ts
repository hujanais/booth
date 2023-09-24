import { Request, Response } from "express";
import { UserService } from "../services/user-service";

import express from "express";
import { LoginUserRequest } from "../models/user-model";
const router = express.Router();

const _userService = new UserService();

// login. POST /api/login
router.post('/login', async (req: Request, res: Response) => {
    const { body } = req;
    const payload: LoginUserRequest = body as LoginUserRequest;

    if (!payload || !payload.username || !payload.password) {
        res.status(401).send('Unauthorized');
    }

    try {
        const jwtToken = _userService.login(payload);
        res.json(jwtToken);
    } catch (err: any) {
        res.status(401).send(err.message);
    }
});

export default router; 