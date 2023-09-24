import { Request, Response, NextFunction } from "express";
import {JWTUtility} from "../utilities/jwt-utility";

const jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');

export const jwtHandler = (req: Request, res: Response, next: NextFunction) => {

    const allowedUrls = ['/api/login'];
    if (allowedUrls.includes(req.originalUrl)) {
        next();
        return;
    }
    
    const bearerToken = req.headers.authorization;

    try {
        const userId = jwtUtility.verifyJWTToken(bearerToken);
        res.locals = { ...res.locals, userId: userId };
        next();
    } catch (err: any) {
        res.status(401).send(err.message);
    }
}