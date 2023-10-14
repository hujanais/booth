import dbFactory from "../db/db-factory";
import { InternalUserModel, LoginUserRequest } from "../models/user-model";
import { JWTUtility } from "../utilities/jwt-utility";
import { v4 as uuidv4 } from 'uuid';

export class UserService {

    private _jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');

    public async register(payload: LoginUserRequest): Promise<void> {
        // check if user already registered.
        const user = await dbFactory.getUserByName(payload.username);
        if (user) {
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
        const user = await dbFactory.getUserByName(payload.username);
        console.log(user?.password, payload.password);
        if (!user || (user.password !== payload.password)) {
            throw new Error(`${payload.username} is not found or invalid password`);
        }

        const sessionId = uuidv4();
        dbFactory.addSession({
            sessionId,
            userId: user.id,
            socketId: null,
            roomId: null
        });
        return this._jwtUtility.signToken(sessionId);
    }

    public logout() {

    }

    public unregister() {

    }

    public update() {

    }
}
