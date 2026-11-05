
import { DatabaseService } from '../services/Database';

export interface User {
    id?: number;
    name: string;
    email: string;
}

export class UserModel {

    // CREATE: Insertar usuario
    static async create(name: string, email: string): Promise<void> {
        const db = DatabaseService.getDb();

        db.run(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]
        );

        await DatabaseService.save();
    }

    // READ: Obtener todos los usuarios
    static readAll(): User[] {
        const db = DatabaseService.getDb();

        const result = db.exec(
            'SELECT * FROM users ORDER BY id DESC'
        );

        if (result.length === 0) return [];

        const { columns, values } = result[0];

        return values.map((row) => {
            const user: any = {};

            columns.forEach((col, i) => {
                user[col] = row[i];
            });

            return user as User;
        });
    }

    // UPDATE: Actualizar usuario
    static async update(
        id: number,
        name: string,
        email: string
    ): Promise<void> {
        const db = DatabaseService.getDb();

        db.run(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );

        await DatabaseService.save();
    }

    // DELETE: Eliminar usuario
    static async delete(id: number): Promise<void> {
        const db = DatabaseService.getDb();

        db.run(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        await DatabaseService.save();
    }
}
