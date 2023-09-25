import dbFactory from "../db/db-factory";
import { LoginUserRequest } from "../models/user-model";
import { JWTUtility } from "../utilities/jwt-utility";

export class UserService {

    private _jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');

    public register() {

    }

    // returns the bearer token
    public login(payload: LoginUserRequest): string {
        const user = dbFactory.users.find(u => u.username === payload.username && u.password === payload.password);
        if (!user) {
            throw new Error (`${payload.username} is not found or invalid password`);
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
