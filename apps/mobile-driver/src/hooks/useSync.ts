import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { getSyncQueue, removeFromSyncQueue } from '../lib/database';
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5063/api';

export function useSync(authState: any) {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setIsOnline(!!online);
      
      if (online && authState?.token) {
        processSyncQueue();
      }
    });

    return () => unsubscribe();
  }, [authState]);

  const processSyncQueue = async () => {
    if (isSyncing || !authState?.token) return;
    setIsSyncing(true);

    try {
      const queue = await getSyncQueue();
      if (queue.length > 0) {
        console.log(`Starting sync of ${queue.length} items...`);
        
        for (const item of queue) {
          try {
            const response = await fetch(`${API_URL}${item.endpoint}`, {
              method: item.method,
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authState.token}` 
              },
              body: item.payload,
            });
            
            if (response.ok) {
              await removeFromSyncQueue(item.id);
              console.log(`Synced item ${item.id} successfully`);
            } else {
              console.error(`Failed to sync item ${item.id}:`, await response.text());
              // For MVP, if it fails (e.g. 400), we might just leave it in the queue or remove it. 
              // To avoid getting stuck, let's just log it.
            }
          } catch (error) {
            console.error(`Network error syncing item ${item.id}:`, error);
            // Stop syncing on first network error and retry later
            break;
          }
        }
        
        // Notify the user if things synced successfully
        // Alert.alert('Sync Complete', 'Offline changes have been uploaded successfully.');
      }
    } catch (error) {
      console.error('Error processing sync queue:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    processSyncQueue
  };
}
