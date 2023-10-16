import { RoomModel } from "../models/room-model";
import { InternalUserModel, UserModel } from "../models/user-model";
import { ChangeType, Session } from "../models/ws-models";
import * as sqlite3 from "sqlite3";
import { DBUsers } from "./db-users";
import { DBRooms } from './db-rooms';

class DBFactory {
    private db: sqlite3.Database;
    private dbUsers: DBUsers;
    private dbRooms: DBRooms;
    private _rooms: RoomModel[] = [];
    private _sessions: Session[] = []; // sessionId to {user, socket} relationship is 1 to 1.

    constructor() {
        this.db = new sqlite3.Database('./db.sqlite', (error) => {
            if (error) {
                console.error(error.message);
                return;
            }
        });

        console.log("Connection with SQLite has been established");
        this.dbUsers = new DBUsers(this.db);
        this.dbRooms = new DBRooms(this.db);

        this.dbUsers.createUsersTable().then(flag => {
            console.log('user-table created');
        }).catch(errmsg => {
            console.log(errmsg)
        });

        this.dbRooms.createRoomsTable().then(flag => {
            console.log('rooms-table created');
        }).catch(errmsg => {
            console.log(errmsg)
        });
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

    public getUserByName(username: string): Promise<InternalUserModel | null> {
        return this.dbUsers.getUserByName(username);
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
        const idx = this._sessions.findIndex(s => s.socket?.id === sessionId);
        if (idx >= 0) {
            this._sessions.splice(idx, 1);
        }
    }

    public getAllSessions(): Session[] {
        return [...this._sessions];
    }
}

export default new DBFactory();
