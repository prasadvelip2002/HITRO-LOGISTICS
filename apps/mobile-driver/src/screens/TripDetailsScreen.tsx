import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { addToSyncQueue, updateCachedTripStatus } from '../lib/database';
import NetInfo from '@react-native-community/netinfo';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:5063/api';

export default function TripDetailsScreen({ trip, authState, onBack }: { trip: any, authState: any, onBack: () => void }) {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const netInfo = await NetInfo.fetch();
      const isOnline = netInfo.isConnected && netInfo.isInternetReachable !== false;

      if (isOnline) {
        const response = await fetch(`${API_URL}/Trips/${trip.id}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authState.token}` 
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (response.ok) {
          await updateCachedTripStatus(trip.id, newStatus);
          Alert.alert('Success', `Trip status updated to ${newStatus}`);
          onBack();
        } else {
          // API error
          throw new Error('API failed');
        }
      } else {
        throw new Error('Offline');
      }
    } catch (error) {
      // Fallback for offline or API down
      console.log('Falling back to offline sync queue', error);
      await addToSyncQueue(`/Trips/${trip.id}/status`, 'PUT', { status: newStatus });
      await updateCachedTripStatus(trip.id, newStatus);
      Alert.alert('Saved Offline', `Your status update to "${newStatus}" has been saved locally and will sync when you are online.`);
      onBack();
    } finally {
      setLoading(false);
    }
  };

  const source = trip.indent?.source || 'Mumbai';
  const dest = trip.indent?.destination || 'Pune';
  const material = trip.indent?.material || 'Auto parts';
  const weight = trip.indent?.weight || 2.5;
  const earnings = trip.freightCharges || 12500;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>🗺️ Map View</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.tripId}>TRIP-{trip.id}</Text>
            <View style={styles.badgeNew}>
              <Text style={styles.badgeNewText}>New Assignment</Text>
            </View>
          </View>

          <View style={styles.locations}>
            <View style={styles.locationItem}>
              <View style={styles.dotBlue} />
              <View>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationValue}>{source}</Text>
              </View>
            </View>
            <View style={styles.line} />
            <View style={styles.locationItem}>
              <View style={styles.dotOrange} />
              <View>
                <Text style={styles.locationLabel}>Dropoff</Text>
                <Text style={styles.locationValue}>{dest}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cargo</Text>
            <Text style={styles.infoValue}>{material} ({weight} Tons)</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>07 Jul, 09:00 AM</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.earningsLabel}>Expected Earnings</Text>
            <Text style={styles.earningsValue}>₹{earnings.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.rejectBtn} onPress={onBack}>
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptBtn} onPress={() => updateStatus('Accepted')} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.acceptBtnText}>Accept Trip</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: '#0f172a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 24,
    color: '#475569',
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginTop: -30, // Overlap the map
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tripId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  badgeNew: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeNewText: {
    color: '#d97706',
    fontSize: 12,
    fontWeight: '700',
  },
  locations: {
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3b82f6',
    marginTop: 4,
    marginRight: 12,
  },
  dotOrange: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f97316',
    marginTop: 4,
    marginRight: 12,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: '#e2e8f0',
    marginLeft: 5,
    marginVertical: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 2,
  },
  locationValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  earningsLabel: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  earningsValue: {
    fontSize: 18,
    color: '#22c55e',
    fontWeight: '800',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtnText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '700',
  },
  acceptBtn: {
    flex: 2,
    paddingVertical: 16,
    backgroundColor: '#1d4ed8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
