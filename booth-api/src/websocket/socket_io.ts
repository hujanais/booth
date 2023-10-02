import dotenv from 'dotenv';
dotenv.config();

import { Server, Socket } from 'socket.io';
import dbFactory from '../db/db-factory';
import { RoomModel } from '../models/room-model';
import { RoomChangedModel, ChangeType, RoomUpdatedModel, UserEnterExitRoomModel } from '../models/ws-models';
import { JWTUtility } from '../utilities/jwt-utility';

const WEBSOCKET_CORS = {
    origin: "*",
    methods: ["GET", "POST"]
}

const connectedUsers: { [key: string]: Socket[] } = {}; // user to socket-channel relationship is 1 to many
const socketIdLookup: { [key: string]: string } = {};  // reverse lookup of socket-id to associated user.  1 to 1

class SocketIo extends Server {

    private static io: SocketIo;
    private static jwtUtility: JWTUtility;

    constructor(httpServer: any) {
        super(httpServer, { cors: WEBSOCKET_CORS })
        SocketIo.jwtUtility = new JWTUtility(process.env.JWT_SECRET || '');
    }

    public static get instance(): SocketIo {
        return SocketIo.io;
    }

    // http://localhost:3001?jwtToken=xxxxxx
    public static init(httpServer: any) {
        SocketIo.io = new SocketIo(httpServer);

        SocketIo.io.on('connection', (socket) => {
            const jwtToken = socket.handshake.query.jwtToken as string;
            if (!jwtToken) {
                console.log('invalid jwtToken');
                return;
            }
            console.log('jwtToken = ', jwtToken)
            const userId = SocketIo.jwtUtility.decodeJWTToken(jwtToken);

            // if invalid username
            console.log(dbFactory.users);
            const user = dbFactory.users.find(u => u.id === userId);
            if (!user) {
                console.log('Invalid username. socket closed');
                socket.emit('error', 'Invalid username.');
                socket.disconnect();
                return;
            }

            console.log('someone joined', socket.id);
            if (!connectedUsers[user.id]) {
                connectedUsers[user.id] = [socket];
            } else {
                connectedUsers[user.id].push(socket);
            }
            socketIdLookup[socket.id] = user.id;

            socket.on('chatmessage', (message: string) => {
                console.log('chatmessage', message, socket.id);
            })

            socket.on('disconnect', () => {
                const associatedUser = socketIdLookup[socket.id];
                delete socketIdLookup[socket.id];
                const idx = connectedUsers[associatedUser].findIndex(v => v.id === socket.id);
                if (idx >= 0) {
                    connectedUsers[associatedUser].splice(idx, 1);
                    if (connectedUsers[associatedUser].length === 0) {
                        delete connectedUsers[associatedUser];
                    }
                }
                console.log('user disconnected', socket.id);
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
                socketChannel.emit(ChangeType.RoomAdded, JSON.stringify(payload));
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
                socketChannel.emit(ChangeType.RoomDeleted, JSON.stringify(payload));
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
                socketChannel.emit(ChangeType.RoomUpdated, JSON.stringify(payload));
            });
        }
    }

    // only notify registered users
    public notifyUserJoined(model: UserEnterExitRoomModel): void {
        const payload: UserEnterExitRoomModel = {
            user: model.user,
            room: model.room
        }

        const sockets = connectedUsers[model.user.id];
        if (sockets) {
            sockets.forEach(socket => {
                socket.send(ChangeType.UserEntered, JSON.stringify(payload));
            });
        }
    }

    // only notify registered users
    public notifyUserLeft(model: UserEnterExitRoomModel): void {
        const payload: UserEnterExitRoomModel = {
            user: model.user,
            room: model.room
        }

        const sockets = connectedUsers[model.user.id];
        if (sockets) {
            sockets.forEach(socket => {
                socket.send(ChangeType.UserExited, JSON.stringify(payload));
            });
        }
    }
}

export default SocketIo;