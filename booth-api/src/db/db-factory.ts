import { RoomModel } from "../models/room-model";
import { InternalUserModel, UserModel } from "../models/user-model";
import { SessionModel } from "../models/ws-models";

import * as sqlite3 from "sqlite3";
import { DBUsers } from "./db-users";
import { DBRooms } from "./db-rooms";
import { DBSessions } from "./user-sessions";

class DBFactory {
    private db: sqlite3.Database;
    private dbUsers: DBUsers;
    private dbRooms: DBRooms;
    private dbSessions: DBSessions;

    private _users: InternalUserModel[] = [];

    public rooms: RoomModel[] = [];

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
        this.dbSessions = new DBSessions();

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

    public async getAllRooms(): Promise<RoomModel[]> {
       return this.dbRooms.getAllRooms();
    }

    public async addRoom(room: RoomModel): Promise<number> {
       return this.dbRooms.addRoom(room);
    }

    public async deleteRoom(roomId: string): Promise<string> {
        return this.dbRooms.deleteRoom(roomId);
    }

    public addSession(session: SessionModel): void {
        this.dbSessions.addSession(session);
    }

    public getSessionById(sessionId: string): SessionModel | undefined {
        return this.dbSessions.getSessionById(sessionId);
    }

    public getSessionBySocketId(socketId: string): SessionModel | undefined  {
        return this.dbSessions.getSessionBySocketId(socketId);
    }

    // public getSessionsByUserId(userIds: string[]): Session[] {
    //     const sessions: Session[] = [];
    //     for (const [key, session] of this._sessions) {
    //         if (userIds.includes(session.user.id)) {
    //             sessions.push(session);
    //         }
    //     }

    //     return sessions;
    // }

    // clean up as session is closed.
    public deleteSessionById(sessionId: string): void {
       this.dbSessions.deleteSessionById(sessionId);
    }

    public getAllSessions(): SessionModel[] {
        return this.dbSessions.getAllSessions();
    }
}

export default new DBFactory();
