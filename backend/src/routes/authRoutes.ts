import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();

// Registrar usuario
router.post('/register', AuthController.register);

// Iniciar sesión
router.post('/login', AuthController.login);

export default router;