import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function AddChargeScreen({ trip, onBack }: { trip: any, onBack: () => void }) {
  const [chargeType, setChargeType] = useState('Unloading');

  const source = trip?.indent?.source || 'Delhi';
  const dest = trip?.indent?.destination || 'Jaipur';
  const tripId = trip?.id || '2287';
  const amount = '3,200';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Raise Additional Charge</Text>
          <Text style={styles.headerSubtitle}>TRIP-{tripId} · {source} → {dest}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Charge Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Charge type</Text>
          <View style={styles.pillsRow}>
            {['Unloading', 'Detention', 'Toll extra', 'Loading wait'].map((type) => (
              <TouchableOpacity 
                key={type} 
                style={[styles.pill, chargeType === type && styles.pillActive]}
                onPress={() => setChargeType(type)}
              >
                <Text style={[styles.pillText, chargeType === type && styles.pillTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Amount Display Card */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amountValue}>₹{amount}</Text>
        </View>

        {/* Attach proof */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Attach proof</Text>
          <TouchableOpacity style={styles.uploadBoxSuccess}>
            <View style={styles.iconCircleSuccess}>
              <Text style={styles.iconSuccess}>✓</Text>
            </View>
            <Text style={styles.uploadedText}>receipt_{tripId}.jpg</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={onBack}>
          <Text style={styles.submitBtnText}>+ Submit Charge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButton: {
    padding: 5,
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 12,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pill: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minWidth: '45%',
  },
  pillActive: {
    backgroundColor: '#1e40af', // Navy blue
    borderColor: '#1e40af',
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#ffffff',
  },
  amountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  amountLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0f172a',
  },
  uploadBoxSuccess: {
    height: 140,
    borderWidth: 2,
    borderColor: '#22c55e', // Green
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#f0fdf4', // Light green
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleSuccess: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconSuccess: {
    color: '#22c55e',
    fontSize: 20,
    fontWeight: 'bold',
  },
  uploadedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15803d', // Dark green
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  submitBtn: {
    backgroundColor: '#f97316', // Orange
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
