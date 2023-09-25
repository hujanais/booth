import * as dotenv from "dotenv";
dotenv.config();
import WebSocket from 'ws';
import { RoomModel } from "../models/room-model";
import { RoomChangedModel, RoomUpdatedModel, UserChangedModel } from "../models/ws-models";

export type WebSocketEx = WebSocket & {uid: string};

const ws_port = +(process.env.WEBSOCKET_PORT || "3001");

class WSService {
    private _wss: WebSocket.Server;
    private _channels: Map<string, WebSocketEx> = new Map<string, WebSocketEx>();

    private parseUserId = (url: string): string | null=> {
        // /?uid=12345
        const matches = url.split('=');
        if (matches.length === 2) return matches[1];
        
        return null;
    }

    constructor() {
        this._wss = new WebSocket.Server({port: ws_port});

        this._wss.on('connection', (ws: WebSocketEx, request: any) => {
            const uId = this.parseUserId(request.url);
            if (!uId) {
                console.log('handle missing uId');
                return;
            }
            ws.uid = uId;
            this._channels.set(uId, ws);

            ws.onmessage = (event: WebSocket.MessageEvent) => {
                console.log(event.data);
                ws.send(`echo ${event.data}`)
            };

            ws.onclose = (event: WebSocket.CloseEvent) => {
                this._channels.delete(ws.uid);
            }
          });
    }

    public notifyRoomAdded(room: RoomModel, rooms: RoomModel[]): void {
        const payload: RoomChangedModel = {
            room: {...room},
            rooms: [...rooms]
        };
        this._channels.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }

    public notifyRoomRemoved(room: RoomModel, rooms: RoomModel[]): void {
        const payload: RoomChangedModel = {
            room: {...room},
            rooms: [...rooms]
        };
        this._channels.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }

    public notifyRoomChanged(room: RoomModel): void {
        const payload: RoomUpdatedModel = {
            room: { ...room },
        }

        this._channels.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }

    public notifyUserJoined(username: string, room: RoomModel): void {
        const payload: UserChangedModel = {
            username: "",
            room: {...room}
        }

        this._channels.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }
    
    public notifyUserLeft(username: string, room: RoomModel): void {
        const payload: UserChangedModel = {
            username: "",
            room: {...room}
        }

        this._channels.forEach((ws, key, map) => {
            ws.send(JSON.stringify(payload));
        });
    }
    
    public notifyNewMessage(): void {}
}

export default new WSService();