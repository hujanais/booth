import { Request, Response } from "express";
import { UserService } from "../services/user-service";

import express from "express";
import { LoginUserRequest } from "../models/user-model";
const router = express.Router();

const _userService = new UserService();

// POST api/user/register
router.post('/register', async (req: Request, res: Response) => {
    const { body } = req;
    const payload: LoginUserRequest = body as LoginUserRequest;

    if (!payload.username || !payload.password) {
        res.status(500).json('invalid username or password');
    }

    try {
        await _userService.register(payload);
        res.json('Thanks for registering');
    } catch (err: any) {
        res.status(500).json(err.message);
    }
})

// DELETE api/user/:userId
router.delete('/:userId', async (req:Request, res: Response) => {
    const userId = req.params.userId;

    try {
        const nRows = await _userService.deleteUser(userId);
        if(nRows > 0) {
            console.log(`${userId} has been deleted`);
        }
        res.json(nRows);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
});

// login. POST /api/user/login
router.post('/login', async (req: Request, res: Response) => {
    const { body } = req;
    const payload: LoginUserRequest = body as LoginUserRequest;

    if (!payload || !payload.username || !payload.password) {
        res.status(401).json('Unauthorized');
    }

    try {
        const jwtToken = await _userService.login(payload);
        res.json(jwtToken);
    } catch (err: any) {
        res.status(500).json(err.message);
    }
});

// GET /users/all.  
router.get('/all', async (req: Request, res: Response) => {
    try {
        const users = await _userService.getAllUsers();
        res.json(users);    
    } catch (err:any) {
        res.status(500).json(err.message);
    }
});


export default router; 