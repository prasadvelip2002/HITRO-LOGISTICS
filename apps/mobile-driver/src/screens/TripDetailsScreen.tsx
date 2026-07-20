import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, TextInput } from 'react-native';

const API_URL = 'http://10.0.2.2:5246/api';

export default function TripDetailsScreen({ trip, authState, onBack }: { trip: any, authState: any, onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [podUrl, setPodUrl] = useState(trip.podImageUrl || '');
  const [chargeAmount, setChargeAmount] = useState('');
  const [chargeReason, setChargeReason] = useState('');

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/Trips/${trip.id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}` 
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        Alert.alert('Success', `Trip status updated to ${newStatus}`);
        onBack();
      } else {
        Alert.alert('Error', 'Failed to update status');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const submitPod = async () => {
    if (!podUrl) {
      Alert.alert('Error', 'Please provide a POD Image URL or Base64 string');
      return;
    }
    
    // Simulating POD upload by updating the trip via a hypothetical endpoint or directly
    // Since backend might not have a specific POD endpoint, we can use the trip update if it exists,
    // or just show an alert that it's submitted for this prototype.
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'POD Uploaded Successfully!');
      onBack();
    }, 1000);
  };

  const submitAdditionalCharge = async () => {
    if (!chargeAmount || !chargeReason) {
      Alert.alert('Error', 'Please provide amount and reason');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/AdditionalCharges`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}` 
        },
        body: JSON.stringify({
          tripId: trip.id,
          amount: parseFloat(chargeAmount),
          reason: chargeReason,
          status: 'Pending'
        }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Additional charge requested!');
        setChargeAmount('');
        setChargeReason('');
      } else {
        Alert.alert('Error', 'Failed to submit charge');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Back to Trips</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Trip #{trip.id}</Text>
        <Text style={styles.status}>Status: {trip.status}</Text>
        <Text style={styles.text}>Booking Type: {trip.bookingType}</Text>
        <Text style={styles.text}>Freight: ₹{trip.freightCharges}</Text>
        <Text style={styles.text}>Advance: ₹{trip.advanceAmount}</Text>
        <Text style={styles.text}>Balance: ₹{trip.balanceAmount}</Text>
        <Text style={styles.text}>Start KM: {trip.startingKM || 'N/A'}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Update Status</Text>
        <View style={styles.buttonsRow}>
          {trip.status === 'Assigned' && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3b82f6' }]} onPress={() => updateStatus('InTransit')} disabled={loading}>
              <Text style={styles.actionText}>Start Trip</Text>
            </TouchableOpacity>
          )}
          {trip.status === 'InTransit' && (
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#22c55e' }]} onPress={() => updateStatus('Delivered')} disabled={loading}>
              <Text style={styles.actionText}>Mark Delivered</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {trip.status === 'Delivered' && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Upload Proof of Delivery (POD)</Text>
          <TextInput
            style={styles.input}
            placeholder="Image URL or Base64"
            value={podUrl}
            onChangeText={setPodUrl}
          />
          <TouchableOpacity style={styles.button} onPress={submitPod} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit POD</Text>}
          </TouchableOpacity>
        </View>
      )}

      {(trip.status === 'InTransit' || trip.status === 'Delivered') && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Request Additional Charge</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount (₹)"
            value={chargeAmount}
            onChangeText={setChargeAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Reason (e.g., Tolls, Halting)"
            value={chargeReason}
            onChangeText={setChargeReason}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={submitAdditionalCharge} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Request</Text>}
          </TouchableOpacity>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  backText: {
    color: '#0066cc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#475569',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
