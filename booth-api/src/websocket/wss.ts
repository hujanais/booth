import * as dotenv from "dotenv";
dotenv.config();
import WebSocket from 'ws';
import { RoomModel } from "../models/room-model";
import { ChangeModel, ChangeType, RoomChangedModel, RoomUpdatedModel, UserEnterExitRoomModel } from "../models/ws-models";
import { UserModel } from "../models/user-model";

export type WebSocketEx = WebSocket & { uid: string };

const ws_port = +(process.env.WEBSOCKET_PORT || "3001");

class WSService {
    private _wss: WebSocket.Server;
    private users: Map<string, WebSocketEx> = new Map<string, WebSocketEx>();

    private parseUserId = (url: string): string | null => {
        // /?jwtToken=12345
        const matches = url.split('=');
        if (matches.length === 2) return matches[1];

        return null;
    }

    constructor() {
        this._wss = new WebSocket.Server({ port: ws_port });

        this._wss.on('connection', (ws: WebSocketEx, request: any) => {
            console.log('connect to ', request.url);
            const uId = this.parseUserId(request.url);
            if (!uId) {
                console.log('handle missing uId');
                return;
            }
            ws.uid = uId;
            this.users.set(uId, ws);

            ws.onmessage = (event: WebSocket.MessageEvent) => {
                console.log(event.data);
                ws.send(`echo ${event.data}`)
            };

            ws.onclose = (event: WebSocket.CloseEvent) => {
                this.users.delete(ws.uid);
            }
        });
    }

    // New room added
    public notifyRoomAdded(room: RoomModel, rooms: RoomModel[]): void {
        const payload: ChangeModel<RoomChangedModel> = {
            changeType: ChangeType.RoomAdded,
            data: {
                room: { ...room },
                rooms: [...rooms]
            }
        };
        this.users.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }

    // Room removed
    public notifyRoomRemoved(room: RoomModel, rooms: RoomModel[]): void {
        const payload: ChangeModel<RoomChangedModel> = {
            changeType: ChangeType.RoomDeleted,
            data: {
                room: { ...room },
                rooms: [...rooms]
            }
        };
        this.users.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }

    // Room modified
    public notifyRoomChanged(room: RoomModel): void {
        const payload: ChangeModel<RoomUpdatedModel> = {
            changeType: ChangeType.RoomUpdated,
            data: {
                room: { ...room }
            }
        };

        this.users.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }

    // only notify registered users
    public notifyUserJoined(payload: UserEnterExitRoomModel): void {
        this.users.forEach((ws, key, map) => {
            if (payload.room.users.map(u => u.id).includes(key)) {
                ws.send(JSON.stringify(payload));
            }
        });
    }

    // only notify registered users
    public notifyUserLeft(payload: UserEnterExitRoomModel): void {
        this.users.forEach((ws, key, map) => {
            if (payload.room.users.map(u => u.id).includes(key) || payload.user.id === key) {
                ws.send(JSON.stringify(payload));
            }
        });
    }

    public notifyNewMessage(): void { }
}

export default new WSService();