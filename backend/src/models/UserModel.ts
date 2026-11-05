
import db from '../config/database';

// Agregar owner_id a la tabla existente sin borrar registros
const columns = db.prepare('PRAGMA table_info(users)').all() as {
    name: string;
}[];

if (!columns.some(column => column.name === 'owner_id')) {
    db.exec('ALTER TABLE users ADD COLUMN owner_id INTEGER');
}

export interface User {
    id?: number;
    name: string;
    email: string;
    owner_id?: number;
}

export class UserModel {

    // Crear usuario asociado a una cuenta
    static create(name: string, email: string, ownerId: number): number {
        const statement = db.prepare(`
            INSERT INTO users (name, email, owner_id)
            VALUES (?, ?, ?)
        `);

        const result = statement.run(name, email, ownerId);

        return Number(result.lastInsertRowid);
    }

    // Obtener solamente los usuarios de una cuenta
    static readAll(ownerId: number): User[] {
        return db.prepare(`
            SELECT id, name, email
            FROM users
            WHERE owner_id = ?
            ORDER BY id DESC
        `).all(ownerId) as User[];
    }

    // Buscar usuario perteneciente a una cuenta
    static findById(id: number, ownerId: number): User | undefined {
        return db.prepare(`
            SELECT id, name, email
            FROM users
            WHERE id = ? AND owner_id = ?
        `).get(id, ownerId) as User | undefined;
    }

    // Actualizar usuario de una cuenta
    static update(
        id: number,
        name: string,
        email: string,
        ownerId: number
    ): void {
        db.prepare(`
            UPDATE users
            SET name = ?, email = ?
            WHERE id = ? AND owner_id = ?
        `).run(name, email, id, ownerId);
    }

    // Eliminar usuario de una cuenta
    static delete(id: number, ownerId: number): void {
        db.prepare(`
            DELETE FROM users
            WHERE id = ? AND owner_id = ?
        `).run(id, ownerId);
    }
}
