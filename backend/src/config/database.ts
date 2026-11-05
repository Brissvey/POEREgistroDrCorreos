
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ruta de la carpeta database
const databaseDirectory = path.join(__dirname, '../../database');

// Crear la carpeta si no existe
if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

// Ruta del archivo SQLite
const databasePath = path.join(databaseDirectory, 'database.sqlite');

// Crear conexión
const db = new Database(databasePath);

// Activar claves foráneas
db.pragma('foreign_keys = ON');

// Crear tabla de usuarios
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    );
`);

console.log('✅ Base de datos SQLite conectada');

export default db;
