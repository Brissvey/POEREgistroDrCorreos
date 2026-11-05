
import { Response } from 'express';
import { UserModel } from '../models/UserModel';
import { AuthRequest } from '../middleware/authMiddleware';

export class UserController {

    // Obtener todos los usuarios de la cuenta
    static getAll(req: AuthRequest, res: Response): void {
        try {
            const ownerId = req.user?.id;

            if (!ownerId) {
                res.status(401).json({ message: 'No autorizado' });
                return;
            }

            const users = UserModel.readAll(ownerId);
            res.json(users);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al obtener los usuarios'
            });
        }
    }

    // Obtener usuario por ID
    static getById(req: AuthRequest, res: Response): void {
        try {
            const ownerId = req.user?.id;
            const id = Number(req.params.id);

            if (!ownerId) {
                res.status(401).json({ message: 'No autorizado' });
                return;
            }

            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'ID no válido' });
                return;
            }

            const user = UserModel.findById(id, ownerId);

            if (!user) {
                res.status(404).json({
                    message: 'Usuario no encontrado'
                });
                return;
            }

            res.json(user);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al buscar el usuario'
            });
        }
    }

    // Crear usuario
    static create(req: AuthRequest, res: Response): void {
        try {
            const ownerId = req.user?.id;
            const { name, email } = req.body;

            if (!ownerId) {
                res.status(401).json({ message: 'No autorizado' });
                return;
            }

            if (
                typeof name !== 'string' ||
                typeof email !== 'string' ||
                !name.trim() ||
                !email.trim()
            ) {
                res.status(400).json({
                    message: 'Nombre y correo son obligatorios'
                });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email.trim())) {
                res.status(400).json({
                    message: 'Correo electrónico no válido'
                });
                return;
            }

            const id = UserModel.create(
                name.trim(),
                email.trim(),
                ownerId
            );

            res.status(201).json({
                message: 'Usuario creado correctamente',
                id
            });

        } catch (error) {
            const message = error instanceof Error ? error.message : '';

            if (message.includes('UNIQUE')) {
                res.status(409).json({
                    message: 'El correo ya está registrado'
                });
                return;
            }

            console.error(error);
            res.status(500).json({
                message: 'Error al crear el usuario'
            });
        }
    }

    // Actualizar usuario
    static update(req: AuthRequest, res: Response): void {
        try {
            const ownerId = req.user?.id;
            const id = Number(req.params.id);
            const { name, email } = req.body;

            if (!ownerId) {
                res.status(401).json({ message: 'No autorizado' });
                return;
            }

            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'ID no válido' });
                return;
            }

            if (
                typeof name !== 'string' ||
                typeof email !== 'string' ||
                !name.trim() ||
                !email.trim()
            ) {
                res.status(400).json({
                    message: 'Nombre y correo son obligatorios'
                });
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email.trim())) {
                res.status(400).json({
                    message: 'Correo electrónico no válido'
                });
                return;
            }

            const user = UserModel.findById(id, ownerId);

            if (!user) {
                res.status(404).json({
                    message: 'Usuario no encontrado'
                });
                return;
            }

            UserModel.update(id, name.trim(), email.trim(), ownerId);

            res.json({
                message: 'Usuario actualizado correctamente'
            });

        } catch (error) {
            const message = error instanceof Error ? error.message : '';

            if (message.includes('UNIQUE')) {
                res.status(409).json({
                    message: 'El correo ya está registrado'
                });
                return;
            }

            console.error(error);
            res.status(500).json({
                message: 'Error al actualizar el usuario'
            });
        }
    }

    // Eliminar usuario
    static delete(req: AuthRequest, res: Response): void {
        try {
            const ownerId = req.user?.id;
            const id = Number(req.params.id);

            if (!ownerId) {
                res.status(401).json({ message: 'No autorizado' });
                return;
            }

            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ message: 'ID no válido' });
                return;
            }

            const user = UserModel.findById(id, ownerId);

            if (!user) {
                res.status(404).json({
                    message: 'Usuario no encontrado'
                });
                return;
            }

            UserModel.delete(id, ownerId);

            res.json({
                message: 'Usuario eliminado correctamente'
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al eliminar el usuario'
            });
        }
    }
}
