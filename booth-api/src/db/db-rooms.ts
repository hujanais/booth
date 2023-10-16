import * as sqlite3 from "sqlite3";
import { RoomModel } from "../models/room-model";
import { MessageModel } from "../models/message-model";
import { v4 as uuidv4 } from 'uuid';

export type DBRoomModel = {
    id: string,
    ownerId: string,
    title: string,
    description: string
}

export class DBRooms {
    private db: sqlite3.Database;

    constructor(db: sqlite3.Database) {
        this.db = db;
    }

    public createRoomsTable(): Promise<string> {
        return new Promise((resolve, reject) => {
            const sql = `
            CREATE TABLE IF NOT EXISTS rooms (
                id TEXT PRIMARY KEY,
                title TEXT,
                description TEXT
            )
        `;

            this.db.run(sql, (error) => {
                if (error) {
                    reject(`create-rooms-table failed. ${error.message}`);
                } else {
                    resolve('ok');
                }
            });
        });
    }

    public async getRoomById(roomId: string): Promise<DBRoomModel> {
        const sql = `SELECT * FROM rooms`;

        return new Promise((resolve, reject) => {
            this.db.get(sql, (error, row: DBRoomModel) => {
                if (error) {
                    reject(error);
                }

                resolve(row);
            })
        });
    }

    public async getAllRooms(): Promise<DBRoomModel[]> {

        const sql = `
            SELECT * FROM rooms
        `;

        const rooms: DBRoomModel[] = await new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows: DBRoomModel[]) => {
                if (err) reject(err);

                resolve(rows);
            });
        });

        return rooms;
    }

    public async addRoom(room: DBRoomModel): Promise<number> {
        const sql = `
        INSERT INTO rooms (id, ownerId, title, description)
        VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {

            this.db.run(sql, [room.id, room.ownerId, room.title, room.description], function (error) {
                if (error) {
                    console.error('Error inserting user:', error.message);
                    reject(-1);
                } else {
                    console.log(`Inserted a row with the ID: ${this.lastID}`);
                    resolve(this.lastID);
                }
            });
        });
    }

    public async deleteRoom(roomId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM rooms WHERE id = ?`, [roomId], (error) => {
                if (error) {
                    reject(error);
                }

                resolve(1)
            })
        });
    }

    public async updateRoom(roomId: string, title: string, description: string): Promise<DBRoomModel> {
        const sql = `
            UPDATE room
            set title = ?, 
            set description = ?,
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            this.db.run(sql, [title, description, roomId], (error: any, row: DBRoomModel) => {
                if (error) reject(error);

                resolve(row);
            });
        })
    }

    public async addMessageToRoom(roomId: string, message: MessageModel): Promise<RoomModel> {
        const sql = `
        UPDATE room SET messages = ? where id = ?
    `;
        return new Promise((resolve, reject) => {
            this.db.run(sql, ['', roomId], (error: any, row: RoomModel) => {
                if (error) {
                    reject(error);
                }

                console.log('###', row);
                resolve(row);
            });
        })
    }

    // const updatedRoom = await dbFactory.addMessageToRoom(room.id, message);

    // room.users.push({ id: user.id, username: user.username, socketId: sessionId });
    // room.messages.push();


}