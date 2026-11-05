import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../models/AuthModel';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_temporal_desarrollo';

export class AuthController {

    static async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                res.status(400).json({
                    message: 'Todos los campos son obligatorios'
                });
                return;
            }

            if (password.length < 8) {
                res.status(400).json({
                    message: 'La contraseña debe tener al menos 8 caracteres'
                });
                return;
            }

            if (AuthModel.findByEmail(email)) {
                res.status(409).json({
                    message: 'Este correo ya está registrado'
                });
                return;
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const userId = AuthModel.create(name, email, passwordHash);

            res.status(201).json({
                message: 'Usuario registrado correctamente',
                user: { id: userId, name, email }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al registrar usuario'
            });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({
                    message: 'Correo y contraseña son obligatorios'
                });
                return;
            }

            const user = AuthModel.findByEmail(email);

            if (!user || !(await bcrypt.compare(password, user.password_hash))) {
                res.status(401).json({
                    message: 'Correo o contraseña incorrectos'
                });
                return;
            }

            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al iniciar sesión'
            });
        }
    }
}