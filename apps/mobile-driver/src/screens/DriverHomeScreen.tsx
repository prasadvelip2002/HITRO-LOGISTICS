import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { cacheTrips, getCachedTrips } from '../lib/database';
import { useSync } from '../hooks/useSync';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5063/api';

export default function DriverHomeScreen({ authState, onSelectTrip }: { authState: any, onSelectTrip: (trip: any) => void }) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isOnline, isSyncing } = useSync(authState);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${API_URL}/Trips`, {
        headers: { 'Authorization': `Bearer ${authState.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Assuming API returns all trips, filter for this driver if backend doesn't filter
        const myTrips = data.filter((t: any) => t.driverId === authState.user.id);
        setTrips(myTrips);
        await cacheTrips(myTrips);
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      console.error('Fetch failed, loading from cache:', error);
      try {
        const cached = await getCachedTrips();
        if (cached && cached.length > 0) {
          setTrips(cached);
        } else {
          // Fallback fake data if cache is empty
          setTrips([
            { id: 2291, status: 'Assigned', indent: { source: 'Mumbai', destination: 'Pune', material: 'Auto parts' } },
            { id: 2287, status: 'InTransit', indent: { source: 'Delhi', destination: 'Jaipur', material: 'Steel' } }
          ]);
        }
      } catch (e) {
        console.error('Cache read failed:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTrip = ({ item }: { item: any }) => {
    const isNew = item.status === 'Assigned' || item.status === 'Draft';
    
    // Safely extract source/destination from trip -> indent, or fallback
    const source = item.indent?.source || 'City A';
    const dest = item.indent?.destination || 'City B';
    const material = item.indent?.material || 'General Goods';

    if (isNew) {
      return (
        <View style={[styles.card, styles.cardNew]}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeNew}>
              <Text style={styles.badgeNewText}>New Trip</Text>
            </View>
            <Text style={styles.tripId}>TRIP-{item.id}</Text>
          </View>
          <View style={styles.routeContainer}>
            <View style={styles.dot} />
            <Text style={styles.routeText}>{source}  →  {dest}</Text>
          </View>
          <Text style={styles.detailsText}>148 km · {material} · 07 Jul 09:00</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.rejectBtn}>
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptBtn} onPress={() => onSelectTrip(item)}>
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.card} onPress={() => onSelectTrip(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.tripId}>TRIP-{item.id}</Text>
          <View style={styles.badgeNormal}>
            <Text style={styles.badgeNormalText}>{item.status}</Text>
          </View>
        </View>
        <View style={styles.routeContainer}>
          <Text style={styles.routeText}>{source}  →  {dest}</Text>
          <Text style={styles.chevron}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>My Trips</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {isSyncing && <ActivityIndicator size="small" color="#fff" />}
            <View style={[styles.statusIndicator, { backgroundColor: isOnline ? '#4ade80' : '#f87171' }]} />
            <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1d4ed8" />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTrip}
          contentContainerStyle={styles.list}
          style={styles.flatList}
        />
      )}

      {/* Fake Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.navActive]}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🚚</Text>
          <Text style={styles.navText}>Trips</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Alerts</Text>
        </View>
        <View style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#1d4ed8',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    marginTop: -20, // Overlap the header slightly
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardNew: {
    borderColor: '#f97316',
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripId: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  badgeNew: {
    backgroundColor: '#f97316',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeNewText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeNormal: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeNormalText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#3b82f6',
    marginRight: 8,
  },
  routeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
  },
  detailsText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectBtnText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 15,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#1d4ed8',
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
  },
  navActive: {
    color: '#1d4ed8',
  },
});
