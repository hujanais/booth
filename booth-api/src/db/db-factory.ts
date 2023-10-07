import { RoomModel } from "../models/room-model";
import { InternalUserModel, UserModel } from "../models/user-model";
import { Session } from "../models/ws-models";

class DBFactory {
    private _users: InternalUserModel[] = [
        {
            id: '11111',    // Bearer eyJhbGciOiJIUzI1NiJ9.MTExMTE.Mwkc_FxYOmECkIahgcnGK4pW1KHfVx8OzN1aaXu01Dg
            username: 'satu',
            password: 'password'
        },
        {
            id: '22222',    // Bearer eyJhbGciOiJIUzI1NiJ9.MjIyMjI.kjNo4dXKb3qgBlsH65ofofxtqFoNbCacZPIR8bsjhhE
            username: 'dua',
            password: 'password'
        }
    ]

    private _rooms: RoomModel[] = [];
    public get rooms(): RoomModel[] {
        return this._rooms;
    }

    public getAllUsers(): InternalUserModel[] {
        return this._users;
    }

    public getUserById(id: string): InternalUserModel | undefined {
        return this._users.find(u => u.id === id);
    }

    public getUserByName(username: string): InternalUserModel | undefined {
        return this._users.find(u => u.username === username);
    }

    public addUser(user: InternalUserModel): void {
        this._users.push(user);
    }

    // // key - sessionId. sessionId to {user, socket} relationship is 1 to 1.
    private _sessions: Map<string, Session> = new Map<string, Session>(); // sessionId to {user, socket} relationship is 1 to 1.
    // public get sessions(): Map<string, Session> {
    //     return this._sessions;
    // }

    public addSession(sessionId: string, value: Session): void {
        this._sessions.set(sessionId, value);
    }

    public getSessionById(sessionId: string): Session | undefined {
        return this._sessions.get(sessionId);
    }

    public getSessionBySocketId(socketId: string): Session | null {
        for (const [key, value] of this._sessions) {
            const session = this._sessions.get(key);
            if (session?.socket?.id === socketId) {
                return session;
            }
        }

        return null;
    }

    public deleteSessionById(sessionId: string): void {
        this._sessions.delete(sessionId);
    }

    public getAllSessions(): Session[] {
        return [...this._sessions.values()];
    }

    private lookupSessionsFromUserId(userId: string): Session[] {
        const foundSessions: Session[] = [];
        for (let sessionId in this._sessions) {
            const session = this._sessions.get(sessionId);
            if (session?.user.id === userId) {
                foundSessions.push(session);
            }
        }

        return foundSessions;
    }
}

export default new DBFactory();
