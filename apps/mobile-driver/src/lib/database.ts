import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('tms_driver.db');
  await initDb(db);
  return db;
}

async function initDb(database: SQLite.SQLiteDatabase) {
  // Create tables for caching and syncing
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS TripsCache (
      id INTEGER PRIMARY KEY,
      data TEXT NOT NULL,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS SyncQueue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT NOT NULL,
      method TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function cacheTrips(trips: any[]) {
  const database = await getDb();
  // Simple approach: clear and insert for MVP
  await database.execAsync('DELETE FROM TripsCache');
  
  const statement = await database.prepareAsync(
    'INSERT INTO TripsCache (id, data) VALUES ($id, $data)'
  );
  
  try {
    for (const trip of trips) {
      await statement.executeAsync({ $id: trip.id, $data: JSON.stringify(trip) });
    }
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getCachedTrips(): Promise<any[]> {
  const database = await getDb();
  const rows = await database.getAllAsync<{ data: string }>('SELECT data FROM TripsCache');
  return rows.map(r => JSON.parse(r.data));
}

export async function updateCachedTripStatus(tripId: number, status: string) {
  const database = await getDb();
  const row = await database.getFirstAsync<{ data: string }>('SELECT data FROM TripsCache WHERE id = ?', tripId);
  if (row) {
    const trip = JSON.parse(row.data);
    trip.status = status;
    await database.runAsync('UPDATE TripsCache SET data = ? WHERE id = ?', JSON.stringify(trip), tripId);
  }
}

export async function addToSyncQueue(endpoint: string, method: string, payload: any) {
  const database = await getDb();
  const statement = await database.prepareAsync(
    'INSERT INTO SyncQueue (endpoint, method, payload) VALUES ($endpoint, $method, $payload)'
  );
  try {
    await statement.executeAsync({
      $endpoint: endpoint,
      $method: method,
      $payload: JSON.stringify(payload)
    });
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getSyncQueue(): Promise<{ id: number, endpoint: string, method: string, payload: string }[]> {
  const database = await getDb();
  return await database.getAllAsync<{ id: number, endpoint: string, method: string, payload: string }>(
    'SELECT * FROM SyncQueue ORDER BY createdAt ASC'
  );
}

export async function removeFromSyncQueue(id: number) {
  const database = await getDb();
  await database.runAsync('DELETE FROM SyncQueue WHERE id = ?', id);
}
