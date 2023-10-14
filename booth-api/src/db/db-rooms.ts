import * as sqlite3 from "sqlite3";
import { RoomModel } from "../models/room-model";

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
                ownerId TEXT,
                title TEXT,
                description TEXT,
                users TEXT,
                messages TEXT
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

    public async getAllRooms(): Promise<RoomModel[]> {
        const sql = `
            SELECT rooms.id, rooms.ownerId, rooms.title, rooms.description, users.username FROM rooms
            JOIN users ON rooms.ownerId = users.id
        `;

        const rooms: RoomModel[] = await new Promise((resolve, reject) => {
            this.db.all(sql, (err, rows) => {
                if (err) reject(err);
                const rooms: RoomModel[] = rows.map((row: any) => {
                    console.log('@@@', row);
                    return {id: row.id, owner: {
                        id: row.ownerId,
                        socketId: null,
                        username: row.username
                    }, title: row.title, description: row.description, users: [], messages: []};
                })

                resolve(rooms);
            });
        });

        return rooms;
    }

    public async addRoom(room: RoomModel): Promise<number> {
        const sql = `
        INSERT INTO rooms (id, ownerId, title, description, users, messages)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        return new Promise((resolve, reject) => {

            this.db.run(sql, [room.id, room.owner.id, room.title, room.description, JSON.stringify([]), JSON.stringify([])], function (error) {
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

    public async deleteRoom(roomId: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM rooms WHERE id = ?`, [roomId], (error) => {
                if (error) {
                    reject(error);      
                }
    
                resolve(roomId)
            })                
        });
    }

}