import dotenv from 'dotenv';
dotenv.config();

import { Server, Socket } from 'socket.io';
import dbFactory from '../db/db-factory';
import { RoomModel } from '../models/room-model';
import { RoomChangedModel, ChangeType, RoomUpdatedModel, UserEnterExitRoomModel } from '../models/ws-models';
import { JWTUtility } from '../utilities/jwt-utility';
import { UserModel } from '../models/user-model';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { CreateMessageRequest, MessageModel } from '../models/message-model';

const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"]
}

const connectedUsers: { [key: string]: Socket[] } = {}; // user to socket-channel relationship is 1 to many
const socketIdLookup: { [key: string]: UserModel } = {};  // reverse lookup of socket-id to associated user.  1 to 1

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
            const userId = this.jwtUtility.decodeJWTToken(jwtToken);

            // if invalid username
            const user = dbFactory.users.find(u => u.id === userId);
            if (!user) {
                console.log('Invalid username. socket closed');
                socket.emit('error', 'Invalid username.');
                socket.disconnect();
                return;
            }

            console.log(`user ${user.username} on ws-channel ${socket.id} has joined`);
            if (!connectedUsers[user.id]) {
                connectedUsers[user.id] = [socket];
            } else {
                connectedUsers[user.id].push(socket);
            }
            socketIdLookup[socket.id] = { id: user.id, username: user.username };

            // when user connects for the first time, sync the system state with client.
            this.sendStateToClient(socket, user);

            // handle incoming message.  optional
            socket.on('chatmessage', (message: string) => {
                console.log('chatmessage', message, socket.id);
            })

            // handle socket disconnect.
            socket.on('disconnect', () => {
                const associatedUser = socketIdLookup[socket.id];
                delete socketIdLookup[socket.id];
                const idx = connectedUsers[associatedUser.id].findIndex(v => v.id === socket.id);
                if (idx >= 0) {
                    connectedUsers[associatedUser.id].splice(idx, 1);
                    if (connectedUsers[associatedUser.id].length === 0) {
                        delete connectedUsers[associatedUser.id];
                    }
                }
                console.log(`user ${associatedUser.username} on ws-channel ${socket.id} has disconnected`);
            })
        });
    }

    // Notify everyone that a new room has been added
    public notifyRoomAdded(room: RoomModel, rooms: RoomModel[]): void {
        const payload: RoomChangedModel = {
            room: { ...room },
            rooms: [...rooms]
        };

        for (const clientKey in connectedUsers) {
            const socketChannels = connectedUsers[clientKey];
            socketChannels.forEach(socketChannel => {
                socketChannel.emit(ChangeType.RoomAdded, payload);
            });
        }
    }

    // Room removed
    public notifyRoomRemoved(room: RoomModel, rooms: RoomModel[]): void {
        const payload: RoomChangedModel = {
            room: { ...room },
            rooms: [...rooms]
        };

        for (const clientKey in connectedUsers) {
            const socketChannels = connectedUsers[clientKey];
            socketChannels.forEach(socketChannel => {
                socketChannel.emit(ChangeType.RoomDeleted, payload);
            });
        }
    }

    // Room modified
    public notifyRoomChanged(room: RoomModel): void {
        const payload: RoomUpdatedModel = {
            room: { ...room }
        };

        for (const clientKey in connectedUsers) {
            const socketChannels = connectedUsers[clientKey];
            socketChannels.forEach(socketChannel => {
                socketChannel.emit(ChangeType.RoomUpdated, payload);
            });
        }
    }

    // only notify registered users
    public notifyUserJoined(payload: UserEnterExitRoomModel): void {
        const sockets = connectedUsers[payload.user.id];
        if (sockets) {
            sockets.forEach(socket => {
                socket.emit(ChangeType.UserEntered, payload);
            });
        }
    }

    // only notify registered users
    public notifyUserLeft(payload: UserEnterExitRoomModel): void {
        const sockets = connectedUsers[payload.user.id];
        if (sockets) {
            sockets.forEach(socket => {
                socket.emit(ChangeType.UserExited, payload);
            });
        }
    }

    // notify joined users with new incoming message.
    public notifyNewMessage(userIds: string[], payload: MessageModel): void {
        for (const userId of userIds) {
            const sockets = connectedUsers[userId];
            if (!sockets) {
                console.log(`notifyNewMessage failed because ${userId} is not connected`);
                return;
            }
            sockets.forEach(socket => {
                socket.emit(ChangeType.NewMessage, payload);
            })
        }
    }

    private sendStateToClient(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, user: UserModel): void {
        // check to see if you are already part of a room.
        const joinedRoom = dbFactory.rooms.find(room => room.users.find(user => user.id === user.id));
        if (joinedRoom) {
            console.log(`${user.id} is already part of the room ${joinedRoom.id}`);
            const userEnterRoomModel: UserEnterExitRoomModel = {
                user: {
                    id: user.id,
                    username: user.username
                },
                room: { ...joinedRoom }
            };
            socket.emit(ChangeType.UserEntered, JSON.stringify(userEnterRoomModel));

            const roomUpdatedModel: RoomChangedModel = {
                room: { ...joinedRoom },
                rooms: [...dbFactory.rooms]
            };
            socket.emit(ChangeType.RoomUpdated, JSON.stringify(roomUpdatedModel));
        }
    }
}

export default new SocketIo();