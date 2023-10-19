import * as sqlite3 from "sqlite3";
import { InternalUserModel } from "../models/user-model";

export class DBUsers {
    private db: sqlite3.Database;

    constructor(db: sqlite3.Database) {
        this.db = db;
    }

    public createUsersTable(): Promise<string> {
        return new Promise((resolve, reject) => {
            const sql = `
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                username TEXT,
                password TEXT
            )
        `;

            this.db.run(sql, (error) => {
                if (error) {
                    reject(`create-users-table failed. ${error.message}`);
                } else {
                    resolve('ok');
                }
            });
        });
    }

    public getUserByName(username: string): Promise<InternalUserModel | null> {
        const sql = `SELECT * FROM users WHERE LOWER(username) = LOWER(?)`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                }

                if (!row) {
                    resolve(null);
                } else {
                    const userRow = row as InternalUserModel;
                    const user: InternalUserModel = {
                        id: userRow.id,
                        username: userRow.username,
                        password: userRow.password
                    }

                    resolve(user);
                }
            })
        })
    }


    public async getUserById(userId: string): Promise<InternalUserModel> {
        const sql = `SELECT * FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            this.db.get(sql, [userId], (error, row: InternalUserModel) => { 
                if (error) {
                    reject(error)
                }

                resolve ({
                    id: row.id,
                    username: row.username,
                    password: row.password
                });
            });
        });
    }

    public async getAllUsers(): Promise<InternalUserModel[]> {
        const users: InternalUserModel[] = await new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM users`, (err, rows) => {
                if (err) reject(err);

                const users: InternalUserModel[] = rows.map((row: any) => {
                    return { id: row.id, username: row.username, password: row.password };
                })

                resolve(users);
            });
        });
        return users;
    }

    public addUser(user: InternalUserModel): Promise<number> {
        return new Promise((resolve, reject) => {
            const insertUser = `
            INSERT INTO users (id, username, password)
            VALUES (?, ?, ?)
        `;

            this.db.run(insertUser, [user.id, user.username, user.password], function (error) {
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

    public deleteUser(userId: string): Promise<number> {
        return new Promise((resolve, reject) => {
            const sql = `
            DELETE FROM users
            WHERE id = ?
        `;
            this.db.run(sql, [userId], function (error) {
                if (error) {
                    console.error('Error inserting user:', error.message);
                    reject(-1);
                } else {
                    console.log(`Row(s) deleted: ${this.changes}`);
                    resolve(this.changes);
                }
            });
        });
    }
}