// Mock database.ts to bypass Expo SQLite file system errors in Expo Go
let tripsCache: any[] = [];
let syncQueue: any[] = [];

export async function cacheTrips(trips: any[]) {
  tripsCache = [...trips];
}

export async function getCachedTrips(): Promise<any[]> {
  return tripsCache;
}

export async function updateCachedTripStatus(tripId: number, status: string) {
  const index = tripsCache.findIndex(t => t.id === tripId);
  if (index >= 0) {
    tripsCache[index].status = status;
  }
}

export async function addToSyncQueue(endpoint: string, method: string, payload: any) {
  syncQueue.push({ id: Date.now(), endpoint, method, payload: JSON.stringify(payload) });
}

export async function getSyncQueue(): Promise<any[]> {
  return syncQueue;
}

export async function removeFromSyncQueue(id: number) {
  syncQueue = syncQueue.filter(item => item.id !== id);
}
