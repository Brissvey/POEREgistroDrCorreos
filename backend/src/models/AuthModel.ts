import db from '../config/database';

db.exec(`
    CREATE TABLE IF NOT EXISTS auth_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    password_hash: string;
}

export class AuthModel {
    static findByEmail(email: string): AuthUser | undefined {
        return db.prepare(`
            SELECT * FROM auth_users WHERE email = ?
        `).get(email) as AuthUser | undefined;
    }

    static create(
        name: string,
        email: string,
        passwordHash: string
    ): number {
        const result = db.prepare(`
            INSERT INTO auth_users (name, email, password_hash)
            VALUES (?, ?, ?)
        `).run(name, email, passwordHash);

        return Number(result.lastInsertRowid);
    }
}