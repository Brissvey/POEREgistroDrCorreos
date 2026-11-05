
import { UserController } from './controllers/UserController';
import { ApiService } from './services/ApiService';

document.addEventListener('DOMContentLoaded', () => {

    console.log('🚀 Iniciando aplicación...');

    // Elementos principales
    const authSection = document.getElementById('authSection')!;
    const appSection = document.getElementById('appSection')!;

    const loginSection = document.getElementById('loginSection')!;
    const registerSection = document.getElementById('registerSection')!;

    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    const registerForm = document.getElementById('registerForm') as HTMLFormElement;

    const showRegisterBtn = document.getElementById('showRegisterBtn')!;
    const showLoginBtn = document.getElementById('showLoginBtn')!;
    const logoutBtn = document.getElementById('logoutBtn')!;

    const loginMessage = document.getElementById('loginMessage')!;
    const registerMessage = document.getElementById('registerMessage')!;

    let userController: UserController | null = null;

    // Mostrar pantalla de inicio de sesión
    function showLogin(): void {
        loginSection.hidden = false;
        registerSection.hidden = true;
        loginMessage.textContent = '';
        registerMessage.textContent = '';
    }

    // Mostrar pantalla de registro
    function showRegister(): void {
        loginSection.hidden = true;
        registerSection.hidden = false;
        loginMessage.textContent = '';
        registerMessage.textContent = '';
    }

    // Cambiar entre login y registro
    showRegisterBtn.addEventListener('click', showRegister);
    showLoginBtn.addEventListener('click', showLogin);

    // Iniciar sesión
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = (
            document.getElementById('loginEmail') as HTMLInputElement
        ).value.trim();

        const password = (
            document.getElementById('loginPassword') as HTMLInputElement
        ).value;

        try {
            loginMessage.textContent = 'Iniciando sesión...';

            await ApiService.login(email, password);

            authSection.hidden = true;
            appSection.hidden = false;

            if (!userController) {
                userController = new UserController();
            }

            console.log('✅ Sesión iniciada correctamente');

        } catch (error) {
            loginMessage.textContent =
                error instanceof Error
                    ? error.message
                    : 'Error al iniciar sesión';

            ApiService.logout();
        }
    });

    // Registrar cuenta
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = (
            document.getElementById('registerName') as HTMLInputElement
        ).value.trim();

        const email = (
            document.getElementById('registerEmail') as HTMLInputElement
        ).value.trim();

        const password = (
            document.getElementById('registerPassword') as HTMLInputElement
        ).value;

        try {
            registerMessage.textContent = 'Registrando cuenta...';

            await ApiService.register(name, email, password);

            registerForm.reset();
            showLogin();

            (document.getElementById('loginEmail') as HTMLInputElement).value = email;

            loginMessage.textContent =
                'Cuenta creada correctamente. Ahora inicia sesión.';

        } catch (error) {
            registerMessage.textContent =
                error instanceof Error
                    ? error.message
                    : 'Error al registrar cuenta';
        }
    });

    // Cerrar sesión
    logoutBtn.addEventListener('click', () => {
        ApiService.logout();

        // Recargar para reiniciar el controlador y sus eventos
        window.location.reload();
    });

    // Mostrar login al abrir la aplicación
    ApiService.logout();
    authSection.hidden = false;
    appSection.hidden = true;
    showLogin();

    console.log('✅ Sistema de autenticación preparado');

});
