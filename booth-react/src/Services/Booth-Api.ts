import { LoginRequest } from "../Models/LoginRequest";

const SERVER_URL = 'http://localhost:3000'

export class BoothApi {

    private static _instance: BoothApi;
    private static jwtToken: string;

    private constructor() {}
    public static get instance(): BoothApi {
        if (!this._instance) {
            this._instance = new BoothApi();
        }

        return this._instance;
    }

    public setJwtToken(token: string): void {
        BoothApi.jwtToken = token;
    }

    // POST /api/user/register
    async login(req: LoginRequest): Promise<Response>{
        return await fetch(`${SERVER_URL}/api/user/login`, { 
            method: 'POST', 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req) });
    }
}