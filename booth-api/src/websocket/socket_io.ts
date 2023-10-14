import dotenv from 'dotenv';
dotenv.config();

import { Server, Socket } from 'socket.io';
import dbFactory from '../db/db-factory';
import { RoomModel } from '../models/room-model';
import { RoomChangedModel, ChangeType, RoomUpdatedModel } from '../models/ws-models';
import { JWTUtility } from '../utilities/jwt-utility';
import { v4 as uuidv4 } from 'uuid';

const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"]
}

class SocketIo {

    private io: Server | undefined;
    private jwtUtility: JWTUtility;
    private wssChannels: Map<string, Socket> = new Map<string, Socket>();

    constructor() {
        this.jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');
    }

    // http://localhost:3001?jwtToken=xxxxxx
    public init(httpServer: any) {
        this.io = new Server(httpServer, { cors: WEBSOCKET_CORS });

        this.io.on('connection', (socket) => {
            const jwtToken = socket.handshake.query.jwtToken as string;
            if (!jwtToken) {
                console.log('invalid jwtToken');
                return;
            }
            const sessionId = this.jwtUtility.decodeJWTToken(jwtToken);
            const session = dbFactory.getSessionById(sessionId);
            if (!session) {
                console.log('Invalid session. socket closed');
                socket.emit('error', 'Invalid session.');
                socket.disconnect();
                return;
            }

            // if invalid username
            if (!session.userId) {
                console.log('Invalid userId. socket closed');
                socket.disconnect();
                return;
            }

            console.log(`user ${session.userId} on ws-channel ${socket.id} has joined`);
            session.socketId = socket.id;
            this.wssChannels.set(socket.id, socket);

            // handle incoming message.  optional
            socket.on('chatmessage', (message: string) => {
                console.log('chatmessage', message, socket.id);
            })

            // handle socket disconnect.
            socket.on('disconnect', async () => {
                // remove the session.
                const session = dbFactory.getSessionBySocketId(socket.id);
                if (session) {
                    console.log(`user ${session.userId} on ws-channel ${socket.id} has disconnected`);
                    dbFactory.deleteSessionById(sessionId);

                    // if user was in a room. remove and notify.
                    const userId = session.userId;
                    const rooms = await dbFactory.getAllRooms();
                    const room = rooms.find(r => r.users.find(u => u.id === userId));
                    if (room) {
                        let idx = room.users.findIndex(u => u.id === userId);
                        if (idx >= 0) {
                            room.users.splice(idx, 1);
                            room.messages.push({
                                id: uuidv4(),
                                owner: {
                                    id: session.userId,
                                    socketId: session.socketId,
                                    username: session.userId
                                },
                                roomId: room.id!,
                                message: `${session.userId} has exited.`,
                                timestamp: Date.now().valueOf()
                            });
                            this.notifyRoomChanged(room);
                            this.notifyNewMessage(room);
                        }
                    }

                }
            })
        });
    }

    // Notify everyone that a new room has been added
    public notifyRoomAdded(room: RoomModel, rooms: RoomModel[]): void {
        const payload: RoomChangedModel = {
            room: { ...room },
            rooms: [...rooms]
        };

        payload.room.messages = [];
        for (const session of dbFactory.getAllSessions()) {
            const socket = this.wssChannels.get(session.socketId!);
            socket?.emit(ChangeType.RoomAdded, payload);
        }
    }

    // Room removed
    public notifyRoomRemoved(room: RoomModel, rooms: RoomModel[]): void {
        const payload: RoomChangedModel = {
            room: { ...room },
            rooms: [...rooms]
        };

        payload.room.messages = [];
        for (const session of dbFactory.getAllSessions()) {
            const socket = this.wssChannels.get(session.socketId!);
            socket?.emit(ChangeType.RoomDeleted, payload);
        }
    }

    // Room modified
    public notifyRoomChanged(room: RoomModel): void {
        const payload: RoomUpdatedModel = {
            room: { ...room }
        };

        payload.room.messages = [];
        for (const session of dbFactory.getAllSessions()) {
            const socket = this.wssChannels.get(session.socketId!);
            socket?.emit(ChangeType.RoomUpdated, payload);
        }
    }

    public notifyNewMessage(room: RoomModel): void {
        const payload: RoomUpdatedModel = {
            room: { ...room }
        };

        const sessionIds = room.users.map(u => u.socketId);
        for (const sessionId of sessionIds) {
            // dbFactory.getSessionById(sessionId!)?.socket?.emit(ChangeType.RoomUpdated, payload);
        }
    }
}

export default new SocketIo();