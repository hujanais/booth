import { Request, Response } from "express";
import { UserService } from "../services/user-service";

import express from "express";
import { LoginUserRequest } from "../models/user-model";
const router = express.Router();

const _userService = new UserService();

router.post('/register', async (req: Request, res: Response) => {
    const { body } = req;
    const payload: LoginUserRequest = body as LoginUserRequest;

    if (!payload.username || !payload.password) {
        res.status(500).send('invalid username or password');
    }

    try {
        _userService.register(payload);
        res.send('Thanks for registering');
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

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

// GET /users.  
router.get('/users', async (req: Request, res: Response) => {
    const users = _userService.getAllUsers();
    res.json(users);
});


export default router; 