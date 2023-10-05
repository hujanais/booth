import dbFactory from "../db/db-factory";
import { InternalUserModel, LoginUserRequest } from "../models/user-model";
import { JWTUtility } from "../utilities/jwt-utility";
import { v4 as uuidv4 } from 'uuid';

export class UserService {

    private _jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');

    public register(payload: LoginUserRequest): void {
        // check if user already registered.
        const user = dbFactory.users.find(u => u.username === payload.username);
        if (user) {
            throw new Error(`The user ${payload.username} already exists`);
        }

        dbFactory.users.push({
            id: uuidv4(),
            username: payload.username,
            password: payload.password
        })
    }

    public getAllUsers(): InternalUserModel[] {
        return dbFactory.users;
    }

    // returns the bearer token
    public login(payload: LoginUserRequest): string {
        const user = dbFactory.users.find(u => u.username === payload.username && u.password === payload.password);
        if (!user) {
            throw new Error(`${payload.username} is not found or invalid password`);
        }

        return this._jwtUtility.signToken(user.id);
    }

    public logout() {

    }

    public unregister() {

    }

    public update() {

    }
}
