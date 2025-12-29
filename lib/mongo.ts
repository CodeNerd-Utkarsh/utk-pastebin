import { Db, MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;


/**
 * Returns a shared MongoDB connection.
 * Reuses the connection across calls (important during dev hot-reload).
 */

export async function getdb() {
    if (db) return db;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');

    client = new MongoClient(uri);
    await client.connect();

    if (!client) throw new Error('Failed to connect to MongoDB');
    db = client.db(process.env.MONGODB_DB_NAME || 'test');
    if (!db) throw new Error('Failure in detecting DB')
    return db;

}