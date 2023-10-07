import dbFactory from "../db/db-factory";
import { InternalUserModel, LoginUserRequest } from "../models/user-model";
import { JWTUtility } from "../utilities/jwt-utility";
import { v4 as uuidv4 } from 'uuid';

export class UserService {

    private _jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');

    public register(payload: LoginUserRequest): void {
        // check if user already registered.
        const user = dbFactory.getUserByName(payload.username);
        if (user) {
            throw new Error(`The user ${payload.username} already exists`);
        }

        dbFactory.addUser({
            id: uuidv4(),
            username: payload.username,
            password: payload.password
        })
    }

    public getAllUsers(): InternalUserModel[] {
        return dbFactory.getAllUsers();
    }

    // returns the bearer token
    public login(payload: LoginUserRequest): string {
        const user = dbFactory.getUserByName(payload.username);
        if (!user || user.password === payload.password) {
            throw new Error(`${payload.username} is not found or invalid password`);
        }

        const sessionId = uuidv4();
        dbFactory.addSession(sessionId, { user: { ...user }, socket: undefined });
        return this._jwtUtility.signToken(sessionId);
    }

    public logout() {

    }

    public unregister() {

    }

    public update() {

    }
}
