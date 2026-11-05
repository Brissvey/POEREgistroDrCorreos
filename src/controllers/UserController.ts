
import { ApiService } from '../services/ApiService';
import type { User } from '../models/UserModel';
import { UserView } from '../views/UserView';

export class UserController {
    private view: UserView;
    private users: User[] = [];

    constructor() {
        this.view = new UserView();
        this.init();
    }

    private init(): void {
        // Registrar eventos del formulario
        this.view.bindSubmit(this.handleSubmit.bind(this));

        // Registrar acciones de la tabla
        this.view.bindTableActions(
            this.handleEdit.bind(this),
            this.handleDelete.bind(this)
        );

        // Escuchar cambios en la búsqueda
        this.view.bindSearch(this.refresh.bind(this));

        // Conectar exportación CSV
        this.view.bindExport(() => this.users);

        // Cargar usuarios desde el backend
        void this.refresh();
    }

    // Crear o actualizar usuario
    private async handleSubmit(
        name: string,
        email: string
    ): Promise<void> {
        if (!name || !email) {
            this.view.showMessage(
                'Por favor completa todos los campos',
                'error'
            );
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            this.view.showMessage(
                'El email no es válido',
                'error'
            );
            return;
        }

        const editingId = this.view.getEditingId();

        try {
            if (editingId !== null) {
                await ApiService.updateUser(editingId, name, email);

                this.view.showMessage(
                    'Usuario actualizado correctamente',
                    'success'
                );
            } else {
                await ApiService.createUser(name, email);

                this.view.showMessage(
                    'Usuario agregado correctamente',
                    'success'
                );
            }

            this.view.resetForm();
            await this.refresh();

        } catch (error) {
            console.error('Error al guardar usuario:', error);

            this.view.showMessage(
                'Error al guardar. Verifica si el email ya existe.',
                'error'
            );
        }
    }

    // Editar usuario
    private async handleEdit(id: number): Promise<void> {
        try {
            const users = await ApiService.getUsers();
            const user = users.find(u => u.id === id);

            if (user) {
                this.view.loadUserForEdit(user);
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error);
            this.view.showMessage(
                'Error al cargar usuario',
                'error'
            );
        }
    }

    // Eliminar usuario
    private async handleDelete(id: number): Promise<void> {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) {
            return;
        }

        try {
            await ApiService.deleteUser(id);

            this.view.showMessage(
                'Usuario eliminado correctamente',
                'success'
            );

            await this.refresh();

        } catch (error) {
            console.error('Error al eliminar usuario:', error);

            this.view.showMessage(
                'Error al eliminar usuario',
                'error'
            );
        }
    }

    // Actualizar tabla y aplicar búsqueda
    private async refresh(): Promise<void> {
        try {
            this.users = await ApiService.getUsers();
            this.view.renderTable(this.users);

        } catch (error) {
            console.error('Error al cargar usuarios:', error);

            this.view.showMessage(
                'No se pudo conectar con el servidor',
                'error'
            );
        }
    }
}
