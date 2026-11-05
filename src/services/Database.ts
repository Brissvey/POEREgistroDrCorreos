
import initSqlJs from 'sql.js';
import type { Database as SqlJsDatabase } from 'sql.js';

export class DatabaseService {
    private static db: SqlJsDatabase | null = null;

    private static readonly DB_NAME = 'SQLiteBrowserDB';
    private static readonly STORE_NAME = 'databases';
    private static readonly DB_KEY = 'sqlite_db';

    // Abrir o crear IndexedDB
    private static openIndexedDB(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);

            request.onupgradeneeded = () => {
                const database = request.result;

                if (!database.objectStoreNames.contains(this.STORE_NAME)) {
                    database.createObjectStore(this.STORE_NAME);
                }
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Recuperar la base de datos desde IndexedDB
    private static async load(): Promise<Uint8Array | null> {
        const database = await this.openIndexedDB();

        return new Promise((resolve, reject) => {
            const transaction = database.transaction(
                this.STORE_NAME,
                'readonly'
            );

            const store = transaction.objectStore(this.STORE_NAME);
            const request = store.get(this.DB_KEY);

            request.onsuccess = () => {
                const result = request.result;

                if (result instanceof ArrayBuffer) {
                    resolve(new Uint8Array(result));
                } else if (result instanceof Uint8Array) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };

            transaction.oncomplete = () => {
                database.close();
            };
        });
    }

    // Inicializar SQL.js y recuperar datos
    static async init(): Promise<SqlJsDatabase> {
        if (this.db) return this.db;

        const SQL = await initSqlJs({
            locateFile: (file: string) => `/${file}`
        });

        // Primero buscar datos en IndexedDB
        const savedData = await this.load();

        if (savedData) {
            this.db = new SQL.Database(savedData);

            console.log('✅ Base de datos recuperada desde IndexedDB');

        } else {
            // Si no existen, buscar datos anteriores en localStorage
            const oldData = localStorage.getItem('sqlite_db');

            if (oldData) {
                const binary = Uint8Array.from(
                    atob(oldData),
                    c => c.charCodeAt(0)
                );

                this.db = new SQL.Database(binary);

                // Migrar los datos anteriores a IndexedDB
                await this.save();

                console.log('✅ Datos migrados de localStorage a IndexedDB');

            } else {
                // Crear una base de datos nueva
                this.db = new SQL.Database();

                console.log('✅ Nueva base de datos creada');
            }
        }

        // Crear tabla de usuarios si no existe
        this.db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            );
        `);

        // Guardar la estructura inicial
        await this.save();

        return this.db;
    }

    // Guardar la base de datos en IndexedDB
    static async save(): Promise<void> {
        if (!this.db) return;

        const database = await this.openIndexedDB();
        const data = this.db.export();

        return new Promise((resolve, reject) => {
            const transaction = database.transaction(
                this.STORE_NAME,
                'readwrite'
            );

            const binary = data.buffer.slice(
                data.byteOffset,
                data.byteOffset + data.byteLength
            );

            transaction.objectStore(this.STORE_NAME).put(
                binary,
                this.DB_KEY
            );

            transaction.oncomplete = () => {
                database.close();
                resolve();
            };

            transaction.onerror = () => {
                database.close();
                reject(transaction.error);
            };

            transaction.onabort = () => {
                database.close();
                reject(transaction.error);
            };
        });
    }

    // Obtener conexión a SQLite
    static getDb(): SqlJsDatabase {
        if (!this.db) {
            throw new Error('Base de datos no inicializada');
        }

        return this.db;
    }
}
