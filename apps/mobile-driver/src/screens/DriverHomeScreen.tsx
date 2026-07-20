import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';

const API_URL = 'http://10.0.2.2:5246/api';

export default function DriverHomeScreen({ authState, onSelectTrip }: { authState: any, onSelectTrip: (trip: any) => void }) {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderTrip = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => onSelectTrip(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.tripId}>Trip #{item.id}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>{item.status}</Text>
      </View>
      <Text style={styles.details}>Date: {item.tripStartDate ? new Date(item.tripStartDate).toLocaleDateString() : 'Pending'}</Text>
      <Text style={styles.details}>Balance: ₹{item.balanceAmount}</Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Assigned': return '#eab308';
      case 'InTransit': return '#3b82f6';
      case 'Delivered': return '#22c55e';
      default: return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trips</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" />
      ) : trips.length === 0 ? (
        <Text style={styles.emptyText}>No assigned trips found.</Text>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTrip}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tripId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 50,
    fontSize: 16,
  },
});
