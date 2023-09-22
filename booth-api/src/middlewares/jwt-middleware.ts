import { Request, Response, NextFunction } from "express";
import {JWTUtility} from "../utilities/jwt-utility";

const jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');

export const jwtHandler = (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;

    try {
        const {username} = jwtUtility.verifyJWTToken(bearerToken);
        res.locals = { ...res.locals, userId: username };
        next()
    } catch (err: any) {
        res.sendStatus(401).send(err.message);
    }