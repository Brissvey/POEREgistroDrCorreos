# SQLite Browser – Sistema de Gestión de Usuarios

Sistema web de gestión de usuarios desarrollado con **TypeScript, Node.js, Express y SQLite**, que implementa operaciones CRUD, autenticación mediante JWT y separación de registros por cuenta de usuario.

El proyecto permite registrar cuentas, iniciar sesión y administrar usuarios de manera independiente. Cada cuenta puede consultar, registrar, editar y eliminar únicamente sus propios registros.

---

## 1. Descripción del proyecto

SQLite Browser es una aplicación web cliente-servidor que permite administrar información de usuarios mediante una interfaz web.

El sistema cuenta con dos componentes principales:

- **Frontend:** interfaz web desarrollada con TypeScript y Vite.
- **Backend:** API REST desarrollada con Node.js y Express, conectada a una base de datos SQLite.

La aplicación implementa autenticación para controlar el acceso a las operaciones del CRUD y utiliza tokens JWT para identificar a los usuarios autenticados.

## 2. Funcionalidades implementadas

### Gestión de usuarios (CRUD)

- Crear usuarios.
- Consultar usuarios registrados.
- Editar información de usuarios.
- Eliminar usuarios.
- Validación de campos obligatorios.
- Validación del formato del correo electrónico.
- Control de correos duplicados.

### Autenticación y seguridad

- Registro de nuevas cuentas.
- Inicio de sesión con correo y contraseña.
- Encriptación de contraseñas mediante bcrypt.
- Generación de tokens JWT.
- Middleware para proteger las rutas.
- Verificación de tokens de autenticación.
- Cierre de sesión.

### Administración independiente de datos

- Separación de registros por cuenta.
- Identificación del propietario mediante `owner_id`.
- Cada cuenta consulta únicamente sus propios registros.
- Protección de operaciones de actualización y eliminación para evitar modificar registros pertenecientes a otras cuentas.

### Funciones adicionales

- Búsqueda de usuarios por nombre o correo electrónico.
- Paginación de resultados.
- Exportación de registros a formato CSV.

---

## 3. Tecnologías utilizadas

| Tecnología | Utilización |
|---|---|
| HTML5 | Estructura de la interfaz |
| CSS3 | Diseño y estilos |
| TypeScript | Desarrollo del frontend y backend |
| Node.js | Entorno de ejecución |
| Express 5 | Framework del backend |
| Vite 8 | Servidor de desarrollo del frontend |
| SQLite | Base de datos |
| better-sqlite3 | Conexión y consultas a SQLite |
| bcryptjs | Protección de contraseñas |
| jsonwebtoken | Autenticación mediante JWT |
| cors | Comunicación entre frontend y backend |
| dotenv | Gestión de variables de entorno |

---

## 4. Requisitos previos

Antes de instalar el proyecto, se necesita:

- Node.js 22.17.0 o una versión compatible posterior.
- npm.
- Git.
- Un navegador web actualizado.
- Visual Studio Code (recomendado).

Para comprobar que Node.js y npm están instalados:

```bash
node -v
npm -v
```

---

## 5. Descargar el proyecto desde GitHub

Abrir una terminal y ejecutar:

```bash
git clone https://github.com/Brissvey/POEREgistroDrCorreos.git
```

Ingresar a la carpeta descargada:

```bash
cd POEREgistroDrCorreos
```

---

## 6. Instalación de dependencias

El proyecto está dividido en frontend y backend. Es necesario instalar las dependencias de ambos componentes.

### 6.1 Instalar dependencias del frontend

Desde la carpeta principal del proyecto:

```bash
npm install
```

### 6.2 Instalar dependencias del backend

Ingresar a la carpeta backend:

```bash
cd backend
```

Ejecutar:

```bash
npm install
```

Regresar a la carpeta principal:

```bash
cd ..
```

**Importante:** `better-sqlite3` utiliza un componente nativo. Si npm solicita herramientas de compilación en el sistema operativo, será necesario instalarlas para completar la instalación.

---

## 7. Configuración de la base de datos

El proyecto utiliza SQLite mediante la dependencia `better-sqlite3`.

La base de datos se genera automáticamente cuando se inicia el backend.

Ubicación:

```text
backend/database/database.sqlite
```

No es necesario crear manualmente la base de datos.

Durante la inicialización se crean las tablas necesarias:

- `users`: almacena los registros administrados mediante el CRUD.
- `auth_users`: almacena las cuentas de autenticación.

También se incorpora el campo `owner_id` en la tabla `users` para relacionar los registros con sus respectivas cuentas.

**Nota:** cada instalación tendrá su propia base de datos local. Los registros de prueba de otra computadora no se incluyen en el repositorio.

---

## 8. Ejecutar el proyecto

Para utilizar la aplicación es necesario iniciar dos servidores independientes: el backend y el frontend.

### 8.1 Iniciar el backend

Abrir una primera terminal y ejecutar:

```bash
cd POEREgistroDrCorreos/backend
```

Iniciar el servidor:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

La API de usuarios se encuentra en:

```text
http://localhost:3000/api/users
```

Las rutas de autenticación se encuentran en:

```text
http://localhost:3000/api/auth
```

El servidor debe permanecer ejecutándose.

### 8.2 Iniciar el frontend

Abrir una segunda terminal.

Ingresar a la carpeta principal:

```bash
cd POEREgistroDrCorreos
```

Iniciar Vite:

```bash
npm run dev
```

Vite mostrará una dirección local. Normalmente será:

```text
http://localhost:5173
```

Abrir esa dirección en el navegador.

**Importante:** ambos servidores deben permanecer ejecutándose mientras se utiliza la aplicación.

---

## 9. Cómo utilizar el sistema

### Registro de cuenta

1. Abrir la aplicación en el navegador.
2. Seleccionar la opción Crear cuenta.
3. Ingresar nombre, correo electrónico y contraseña.
4. La contraseña debe tener al menos 8 caracteres.
5. Completar el registro.

### Inicio de sesión

1. Regresar a la pantalla de inicio de sesión.
2. Introducir el correo electrónico registrado.
3. Introducir la contraseña.
4. Acceder al sistema.

### Administración de usuarios

Una vez iniciada la sesión, el usuario puede:

1. Agregar nuevos registros.
2. Consultar sus registros.
3. Buscar por nombre o correo electrónico.
4. Editar registros existentes.
5. Eliminar registros.
6. Exportar la información a CSV.

### Prueba de separación de cuentas

Para comprobar el funcionamiento multiusuario:

1. Registrar una primera cuenta.
2. Iniciar sesión con esa cuenta.
3. Crear algunos registros.
4. Cerrar sesión.
5. Registrar una segunda cuenta.
6. Iniciar sesión con la segunda cuenta.
7. Comprobar que únicamente aparecen los registros creados por esa cuenta.

---

## 10. Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar una cuenta |
| POST | `/api/auth/login` | Iniciar sesión |

### Usuarios

Todas estas rutas requieren un token JWT válido en la cabecera `Authorization`.

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/users` | Obtener usuarios de la cuenta |
| GET | `/api/users/:id` | Consultar un usuario |
| POST | `/api/users` | Crear un usuario |
| PUT | `/api/users/:id` | Actualizar un usuario |
| DELETE | `/api/users/:id` | Eliminar un usuario |

Formato de autenticación:

```text
Authorization: Bearer TOKEN_JWT
```

---

## 11. Estructura del proyecto

```text
POEREgistroDrCorreos/
│
├── backend/
│   ├── database/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   │
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   └── UserController.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   │
│   │   ├── models/
│   │   │   ├── AuthModel.ts
│   │   │   └── UserModel.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── userRoutes.ts
│   │   │
│   │   └── server.ts
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
│
├── public/
│
├── src/
│   ├── assets/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── styles/
│   ├── views/
│   └── main.ts
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── README.md
```

---

## 12. Compilar el proyecto

Para verificar el frontend:

```bash
npm run build
```

Para compilar el backend:

```bash
cd backend
npm run build
```

El frontend genera sus archivos de producción en `dist/`.

El backend genera sus archivos compilados en `backend/dist/`.

---

## 13. Comandos principales

| Acción | Comando |
|---|---|
| Instalar frontend | `npm install` |
| Instalar backend | `cd backend && npm install` |
| Ejecutar frontend | `npm run dev` |
| Ejecutar backend | `cd backend && npm run dev` |
| Compilar frontend | `npm run build` |
| Compilar backend | `cd backend && npm run build` |

---

## 14. Repositorio

Código fuente disponible en GitHub:

https://github.com/Brissvey/POEREgistroDrCorreos

---

## 15. Autor

Proyecto académico desarrollado como práctica de programación web, utilizando TypeScript, arquitectura cliente-servidor, API REST, SQLite y autenticación mediante JWT.

**Tecnologías principales:** TypeScript, Node.js, Express, SQLite y Vite.

