
const API_URL = 'http://localhost:3000/api/users';
const AUTH_URL = 'http://localhost:3000/api/auth';

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthResponse {
    message: string;
    token: string;
    user: User;
}

export class ApiService {

    // Guardar token
    static saveToken(token: string): void {
        sessionStorage.setItem('auth_token', token);
    }

    // Obtener token
    static getToken(): string | null {
        return sessionStorage.getItem('auth_token');
    }

    // Cerrar sesión
    static logout(): void {
        sessionStorage.removeItem('auth_token');
    }

    // Headers con autenticación
    private static getHeaders(): HeadersInit {
        const token = this.getToken();

        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
    }

    // Registrar cuenta
    static async register(
        name: string,
        email: string,
        password: string
    ): Promise<void> {
        const response = await fetch(`${AUTH_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al registrar usuario');
        }
    }

    // Iniciar sesión
    static async login(
        email: string,
        password: string
    ): Promise<AuthResponse> {
        const response = await fetch(`${AUTH_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al iniciar sesión');
        }

        const data: AuthResponse = await response.json();

        this.saveToken(data.token);

        return data;
    }

    // Obtener todos los usuarios
    static async getUsers(): Promise<User[]> {
        const response = await fetch(API_URL, {
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        return response.json();
    }

    // Crear usuario
    static async createUser(name: string, email: string): Promise<void> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ name, email })
        });

        if (!response.ok) {
            throw new Error('Error al crear usuario');
        }
    }

    // Actualizar usuario
    static async updateUser(
        id: number,
        name: string,
        email: string
    ): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ name, email })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar usuario');
        }
    }

    // Eliminar usuario
    static async deleteUser(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders()
        });

        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }
    }
}
