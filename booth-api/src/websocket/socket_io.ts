import dotenv from 'dotenv';
dotenv.config();

import { Server, Socket } from 'socket.io';
import dbFactory from '../db/db-factory';
import { RoomModel } from '../models/room-model';
import { RoomChangedModel, ChangeType, RoomUpdatedModel, Session } from '../models/ws-models';
import { JWTUtility } from '../utilities/jwt-utility';
import { UserModel } from '../models/user-model';

const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"]
}

class SocketIo {

    private io: Server | undefined;
    private jwtUtility: JWTUtility;

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
            const user = dbFactory.getSessionById(sessionId)?.user;

            // if invalid username
            if (!user) {
                console.log('Invalid username. socket closed');
                socket.emit('error', 'Invalid username.');
                socket.disconnect();
                return;
            }

            console.log(`user ${user.username} on ws-channel ${socket.id} has joined`);

            // handle incoming message.  optional
            socket.on('chatmessage', (message: string) => {
                console.log('chatmessage', message, socket.id);
            })

            // handle socket disconnect.
            socket.on('disconnect', () => {
                // remove the session.
                const session = dbFactory.getSessionBySocketId(socket.id);
                if (session) {
                    console.log(`user ${dbFactory.getSessionById(sessionId)?.user.username} on ws-channel ${socket.id} has disconnected`);
                    dbFactory.deleteSessionById(sessionId);
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

        for (const session of dbFactory.getAllSessions()) {
            session.socket?.emit(ChangeType.RoomAdded, payload);
        }
    }

    // Room removed
    public notifyRoomRemoved(room: RoomModel, rooms: RoomModel[]): void {
        const payload: RoomChangedModel = {
            room: { ...room },
            rooms: [...rooms]
        };

        for (const session of dbFactory.getAllSessions()) {
            session.socket?.emit(ChangeType.RoomAdded, payload);
        }
    }

    // Room modified
    public notifyRoomChanged(room: RoomModel): void {
        const payload: RoomUpdatedModel = {
            room: { ...room }
        };

        for (const session of dbFactory.getAllSessions()) {
            session.socket?.emit(ChangeType.RoomAdded, payload);
        }
    }

    // only notify registered users
    // public notifyUserJoined(payload: UserEnterExitRoomModel): void {
    //     const sockets = connectedUsers[payload.user.id];
    //     if (sockets) {
    //         sockets.forEach(socket => {
    //             socket.emit(ChangeType.UserEntered, payload);
    //         });
    //     }
    // }

    // only notify registered users
    // public notifyUserLeft(payload: UserEnterExitRoomModel): void {
    //     const sockets = connectedUsers[payload.user.id];
    //     if (sockets) {
    //         sockets.forEach(socket => {
    //             socket.emit(ChangeType.UserExited, payload);
    //         });
    //     }
    // }

    // notify joined users with new incoming message.
    // public notifyNewMessage(userIds: string[], payload: MessageModel): void {
    //     for (const userId of userIds) {
    //         const sockets = connectedUsers[userId];
    //         if (!sockets) {
    //             console.log(`notifyNewMessage failed because ${userId} is not connected`);
    //             return;
    //         }
    //         sockets.forEach(socket => {
    //             socket.emit(ChangeType.NewMessage, payload);
    //         })
    //     }
    // }
}

export default new SocketIo();