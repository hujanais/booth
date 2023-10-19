import { RoomModel } from "../models/room-model";
import { InternalUserModel, UserModel } from "../models/user-model";
import { ChangeType, Session } from "../models/ws-models";
import * as sqlite3 from "sqlite3";
import { DBUsers } from "./db-users";
import { DBRoomModel, DBRooms } from './db-rooms';

class DBFactory {
    private db!: sqlite3.Database;
    private dbUsers!: DBUsers;
    private dbRooms!: DBRooms;
    private _rooms: RoomModel[] = [];
    private _sessions: Session[] = []; // sessionId to {user, socket} relationship is 1 to 1.

    constructor() {

    }

    /** Users */

    public async initialize(): Promise<boolean> {
        this.db = new sqlite3.Database('./db.sqlite', (error) => {
            if (error) {
                console.error(error.message);
                return;
            }
        });
        console.log("Connection with SQLite has been established");
        this.dbUsers = new DBUsers(this.db);
        this.dbRooms = new DBRooms(this.db);

        await this.dbUsers.createUsersTable();
        console.log('user-table created');
        await this.dbRooms.createRoomsTable();
        console.log('rooms-table created');

        const savedRooms: DBRoomModel[] = await this.dbRooms.getAllRooms();
        for (const room of savedRooms) {
            this._rooms.push({
                id: room.id,
                owner: {
                    id: room.ownerId,
                    username: room.ownerName
                },
                users: [],
                title: room.title,
                description: room.description,
                messages: []
            });
        }

        console.log('initialization completed');
        return true;
    }

    public async getUserById(id: string): Promise<InternalUserModel> {
        return this.dbUsers.getUserById(id);
    }

    public async getAllUsers(): Promise<InternalUserModel[]> {
        return this.dbUsers.getAllUsers();
    }

    public addUser(user: InternalUserModel): Promise<number> {
        return this.dbUsers.addUser(user);
    }

    public deleteUser(userId: string): Promise<number> {
        return this.dbUsers.deleteUser(userId);
    }

    public getUserByName(username: string): Promise<InternalUserModel | null> {
        return this.dbUsers.getUserByName(username);
    }

    /** Rooms */
    public async addRoom(room: RoomModel): Promise<void> {
        await this.dbRooms.addRoom({
            id: room.id,
            ownerId: room.owner.id,
            ownerName: room.owner.username,
            title: room.title,
            description: room.description
        });

        this._rooms.push(room);
    }

    public async deleteRoom(roomId: string): Promise<void> {
        await this.dbRooms.deleteRoom(roomId);

        const idx = this._rooms.findIndex(r => r.id === roomId);
        if (idx >= 0) {
            this._rooms.splice(idx, 1);
        }
    }

    public get rooms(): RoomModel[] {
        return this._rooms;
    }

    /** Sessions */

    public get sessions(): Session[] {
        return this._sessions;
    }

    public addSession(session: Session): void {
        const sess = this._sessions.find(s => s.socket?.id === session.sessionId);
        if (sess) {
            console.log('session already exists');
            return;
        }

        this._sessions.push(session);
    }

    public getSessionById(sessionId: string): Session | undefined {
        return this._sessions.find(s => s.sessionId === sessionId);
    }

    public getSessionBySocketId(socketId: string): Session | undefined {
        return this._sessions.find(s => s.socket?.id === socketId);
    }

    // clean up as session is closed.
    public deleteSessionById(sessionId: string): void {
        const idx = this._sessions.findIndex(s => s.sessionId === sessionId);
        if (idx >= 0) {
            this._sessions.splice(idx, 1);
        }
    }

    public getAllSessions(): Session[] {
        return [...this._sessions];
    }
}

export default new DBFactory();
