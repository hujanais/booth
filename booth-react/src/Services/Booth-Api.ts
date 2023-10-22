import { CreateRoomRequest, RoomModel } from "../Models/room-model";
import { LoginUserRequest } from "../Models/user-model";
import { WssService } from "./Wss-Service";
import { RoomUpdatedModel } from "../Models/ws-models";
import { CreateMessageRequest } from "../Models/message-model";
import { Observable, Subject } from "rxjs";

const SERVER_URL = process.env.SERVER_ENDPOINT || 'http://localhost:3000'
const SERVER_WSS_URL = process.env.SERVER_WSS_ENDPOINT || 'http://localhost:3001';

export class BoothApi {

    private static _instance: BoothApi;
    private jwtToken: string = '';
    private wss: WssService = new WssService();
    private isInRoom$ = new Subject<boolean>();

    private constructor() {
    }

    public static get instance(): BoothApi {
        if (!this._instance) {
            this._instance = new BoothApi();
        }

        return this._instance;
    }

    public get wssInstance(): WssService {
        return this.wss;
    }

    public get isInRoom(): Observable<boolean> {
        return this.isInRoom$.asObservable();
    }

    // POST /api/user/register
    async login(req: LoginUserRequest): Promise<void> {
        try {
            const resp = await fetch(`${SERVER_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req)
            });

            const json = await resp.json();
            if (!resp.ok) {
                throw Error(`${resp.status}. ${json}`)
            }

            this.jwtToken = json;
            this.wss.connect(SERVER_WSS_URL, this.jwtToken);
        } catch (err) {
            throw (err);
        }
    }

    async getAllRooms(): Promise<RoomUpdatedModel[]> {
        try {
            const resp = await fetch(`${SERVER_URL}/api/rooms`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.jwtToken}`
                }
            });

            const json = await resp.json();
            if (!resp.ok) {
                throw Error(`${resp.status}. ${json}`)
            }

            return json;
        } catch (err) {
            throw (err);
        }

    }

    async createRoom(newRoom: CreateRoomRequest): Promise<void> {
        try {
            const resp = await fetch(`${SERVER_URL}/api/room`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.jwtToken}`
                },
                body: JSON.stringify(newRoom)
            });

            const json = await resp.json();
            if (!resp.ok) {
                throw Error(`${resp.status}. ${json}`)
            }
            return json;
        } catch (err) {
            throw (err);
        }
    }

    async deleteRoom(roomId: string): Promise<RoomModel> {
        try {
            const resp = await fetch(`${SERVER_URL}/api/room/${roomId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.jwtToken}`
                }
            });

            const json = await resp.json();
            if (!resp.ok) {
                throw Error(`${resp.status}. ${json}`)
            }
            return json;
        } catch (err) {
            throw (err);
        }
    }

    async joinRoom(roomId: string): Promise<RoomModel> {
        try {
            const resp = await fetch(`${SERVER_URL}/api/room/join/${roomId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.jwtToken}`
                }
            });

            const json = await resp.json();
            if (!resp.ok) {
                throw Error(`${resp.status}. ${json}`)
            }

            this.isInRoom$.next(true);
            return json;
        } catch (err) {
            throw (err);
        }
    }

    async exitRoom(roomId: string): Promise<RoomModel> {
        try {
            const resp = await fetch(`${SERVER_URL}/api/room/join/${roomId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.jwtToken}`
                }
            });

            const json = await resp.json();
            if (!resp.ok) {
                throw Error(`${resp.status}. ${json}`)
            }

            this.isInRoom$.next(false);
            return json;
        } catch (err) {
            throw (err);
        }
    }

    async sendMessage(payload: CreateMessageRequest) {
        try {
            const resp = await fetch(`${SERVER_URL}/api/message`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.jwtToken}`
                },
                body: JSON.stringify(payload)
            });

            const json = await resp.json();
            if (!resp.ok) {
                throw Error(`${resp.status}. ${json}`)
            }
            return json;
        } catch (err) {
            throw (err);
        }
    }
}