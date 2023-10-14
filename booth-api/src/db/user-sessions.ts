import { SessionModel } from "../models/ws-models";

export class DBSessions {
    // // key - sessionId. sessionId to {user, socket} relationship is 1 to 1.
    private _sessions: SessionModel[] = []; // sessionId to {user, socket} relationship is 1 to 1.

    public addSession(session: SessionModel): void {
        const sess = this._sessions.find(s => s.sessionId === session.sessionId);
        if (sess) {
            console.log('session already exists');
            return;
        }

        this._sessions.push(session);
    }

    public getSessionById(sessionId: string): SessionModel | undefined {
        return this._sessions.find(s => s.sessionId === sessionId);
    }

    public getSessionBySocketId(socketId: string): SessionModel | undefined {
        return this._sessions.find(s => s.socketId === socketId);
    }

    // clean up as session is closed.
    public deleteSessionById(sessionId: string): void {
        const idx = this._sessions.findIndex(s => s.sessionId === sessionId);
        if (idx >= 0) {
            this._sessions.splice(idx, 1);
        }
    }

    public getAllSessions(): SessionModel[] {
        return [...this._sessions];
    }
}