
import type { User } from '../models/UserModel';

export class UserView {
    private form: HTMLFormElement;
    private nameInput: HTMLInputElement;
    private emailInput: HTMLInputElement;
    private tableBody: HTMLTableSectionElement;
    private message: HTMLDivElement;
    private searchInput: HTMLInputElement;
    private exportCsvBtn: HTMLButtonElement;
    private paginationContainer: HTMLDivElement;

    private editingId: number | null = null;
    private currentPage: number = 1;
    private readonly usersPerPage: number = 5;
    private filteredUsers: User[] = [];

    constructor() {
        this.form = document.getElementById('userForm') as HTMLFormElement;
        this.nameInput = document.getElementById('name') as HTMLInputElement;
        this.emailInput = document.getElementById('email') as HTMLInputElement;
        this.tableBody = document.getElementById('userTableBody') as HTMLTableSectionElement;
        this.message = document.getElementById('message') as HTMLDivElement;
        this.searchInput = document.getElementById('searchInput') as HTMLInputElement;
        this.exportCsvBtn = document.getElementById('exportCsvBtn') as HTMLButtonElement;

        this.paginationContainer = document.createElement('div');
        this.paginationContainer.className = 'pagination';

        this.tableBody.parentElement?.insertAdjacentElement(
            'afterend',
            this.paginationContainer
        );
    }

    getFormData(): { name: string; email: string } {
        return {
            name: this.nameInput.value.trim(),
            email: this.emailInput.value.trim()
        };
    }

    renderTable(users: User[]): void {
        const searchTerm = this.searchInput.value.trim().toLowerCase();

        this.filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );

        const totalPages = Math.ceil(
            this.filteredUsers.length / this.usersPerPage
        );

        if (this.currentPage > totalPages) {
            this.currentPage = Math.max(1, totalPages);
        }

        if (this.filteredUsers.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty">
                        ${searchTerm
                            ? 'No se encontraron usuarios'
                            : 'No hay usuarios registrados'}
                    </td>
                </tr>
            `;

            this.renderPagination(0);
            return;
        }

        const startIndex = (this.currentPage - 1) * this.usersPerPage;

        const pageUsers = this.filteredUsers.slice(
            startIndex,
            startIndex + this.usersPerPage
        );

        this.tableBody.innerHTML = pageUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn-edit"
                        data-id="${user.id}" data-action="edit">
                        ✏️ Editar
                    </button>

                    <button class="btn-delete"
                        data-id="${user.id}" data-action="delete">
                        🗑️ Eliminar
                    </button>
                </td>
            </tr>
        `).join('');

        this.renderPagination(totalPages);
    }

    private renderPagination(totalPages: number): void {
        if (totalPages <= 1) {
            this.paginationContainer.innerHTML = '';
            return;
        }

        this.paginationContainer.innerHTML = `
            <button id="previousPage"
                ${this.currentPage === 1 ? 'disabled' : ''}>
                ◀ Anterior
            </button>

            <span>Página ${this.currentPage} de ${totalPages}</span>

            <button id="nextPage"
                ${this.currentPage === totalPages ? 'disabled' : ''}>
                Siguiente ▶
            </button>
        `;

        document.getElementById('previousPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderTableFromFiltered();
            }
        });

        document.getElementById('nextPage')?.addEventListener('click', () => {
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderTableFromFiltered();
            }
        });
    }

    private renderTableFromFiltered(): void {
        const totalPages = Math.ceil(
            this.filteredUsers.length / this.usersPerPage
        );

        const startIndex = (this.currentPage - 1) * this.usersPerPage;

        const pageUsers = this.filteredUsers.slice(
            startIndex,
            startIndex + this.usersPerPage
        );

        this.tableBody.innerHTML = pageUsers.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <button class="btn-edit"
                        data-id="${user.id}" data-action="edit">
                        ✏️ Editar
                    </button>

                    <button class="btn-delete"
                        data-id="${user.id}" data-action="delete">
                        🗑️ Eliminar
                    </button>
                </td>
            </tr>
        `).join('');

        this.renderPagination(totalPages);
    }

    bindSearch(handler: () => void): void {
        this.searchInput.addEventListener('input', () => {
            this.currentPage = 1;
            handler();
        });
    }

    // Conectar botón de exportación
    bindExport(handler: () => User[]): void {
        this.exportCsvBtn.addEventListener('click', () => {
            const users = handler();
            this.exportToCSV(users);
        });
    }

    // Generar y descargar archivo CSV
    private exportToCSV(users: User[]): void {
        if (users.length === 0) {
            this.showMessage('No hay usuarios para exportar', 'error');
            return;
        }

        const headers = ['ID', 'Nombre', 'Email'];

        const rows = users.map(user => [
            user.id,
            user.name,
            user.email
        ]);

        const escapeCSV = (value: string | number | undefined): string => {
            const text = String(value ?? '');
            return `"${text.replace(/"/g, '""')}"`;
        };

        const csvContent = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\r\n');

        // BOM para que Excel reconozca correctamente los acentos
        const blob = new Blob(
            ['\uFEFF' + csvContent],
            { type: 'text/csv;charset=utf-8;' }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'usuarios.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        this.showMessage('Archivo CSV exportado correctamente', 'success');
    }

    showMessage(text: string, type: 'success' | 'error'): void {
        this.message.textContent = text;
        this.message.className = `message ${type}`;

        setTimeout(() => {
            this.message.textContent = '';
            this.message.className = 'message';
        }, 3000);
    }

    loadUserForEdit(user: User): void {
        this.nameInput.value = user.name;
        this.emailInput.value = user.email;
        this.editingId = user.id!;

        const submitBtn = this.form.querySelector(
            'button[type="submit"]'
        ) as HTMLButtonElement;

        submitBtn.textContent = '💾 Actualizar';
    }

    resetForm(): void {
        this.form.reset();
        this.editingId = null;

        const submitBtn = this.form.querySelector(
            'button[type="submit"]'
        ) as HTMLButtonElement;

        submitBtn.textContent = '➕ Agregar Usuario';
    }

    bindSubmit(handler: (name: string, email: string) => void): void {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const { name, email } = this.getFormData();
            handler(name, email);
        });
    }

    bindTableActions(
        onEdit: (id: number) => void,
        onDelete: (id: number) => void
    ): void {
        this.tableBody.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const button = target.closest('button') as HTMLButtonElement | null;

            if (!button) return;

            const action = button.dataset.action;
            const id = Number(button.dataset.id);

            if (action === 'edit') onEdit(id);
            else if (action === 'delete') onDelete(id);
        });
    }

    getEditingId(): number | null {
        return this.editingId;
    }
}
