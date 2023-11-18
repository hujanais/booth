import dbFactory from "../db/db-factory";
import { InternalUserModel, LoginUserRequest } from "../models/user-model";
import { Session } from "../models/ws-models";
import { JWTUtility } from "../utilities/jwt-utility";
import { v4 as uuidv4 } from 'uuid';

export class UserService {

    private _jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');

    public async register(payload: LoginUserRequest): Promise<void> {
        // check if user already registered.
        const user = await dbFactory.getUserByName(payload.username);
        if (user) {
            console.log(`The user ${payload.username} already exists`)
            throw new Error(`The user ${payload.username} already exists`);
        }

        await dbFactory.addUser({
            id: uuidv4(),
            username: payload.username,
            password: payload.password
        })
    }

    public async getAllUsers(): Promise<InternalUserModel[]> {
        return dbFactory.getAllUsers();
    }

    // returns the bearer token
    public async login(payload: LoginUserRequest): Promise<string> {
        if (!payload.username || !payload.password) {
            throw new Error('Invalid login request');
        }

        const user = await dbFactory.getUserByName(payload.username);
        // remove this stringent test to allow guest access.
        // if (!user || (user.password !== payload.password)) {
        //     throw new Error(`${payload.username} is not found or invalid password`);
        // }

        const existingUser = dbFactory.sessions.find(s => s.user.username.toLowerCase() === payload.username.toLowerCase());
        if (existingUser) {
            throw new Error(`Sorry but ${payload.username} has already been taken`);
        }

        const newSession: Session = {
            sessionId: uuidv4(),
            user: {
                id: uuidv4(),
                username: payload.username
            },
            socket: null,
            roomId: null
        };

        dbFactory.sessions.push(newSession);
        return this._jwtUtility.signToken(newSession.sessionId);
    }

    public logout() {

    }

    public async deleteUser(userId:string): Promise<number> {
        return dbFactory.deleteUser(userId);
    }

    public update() {

    }
}