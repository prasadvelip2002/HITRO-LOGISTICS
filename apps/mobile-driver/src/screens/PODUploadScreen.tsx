import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function PODUploadScreen({ trip, onBack, onComplete }: { trip: any, onBack: () => void, onComplete: () => void }) {
  const [frontUploaded, setFrontUploaded] = useState(true); // Default true to match mockup
  const [backUploaded, setBackUploaded] = useState(false);

  const source = trip?.indent?.source || 'Delhi';
  const dest = trip?.indent?.destination || 'Jaipur';
  const tripId = trip?.id || '2287';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Upload POD</Text>
          <Text style={styles.headerSubtitle}>TRIP-{tripId} · {source} → {dest}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Front Side */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Front side</Text>
          <TouchableOpacity 
            style={[styles.uploadBox, frontUploaded && styles.uploadBoxSuccess]}
            onPress={() => setFrontUploaded(!frontUploaded)}
          >
            {frontUploaded ? (
              <>
                <View style={styles.iconCircleSuccess}>
                  <Text style={styles.iconSuccess}>✓</Text>
                </View>
                <Text style={styles.uploadedText}>POD_front.jpg uploaded</Text>
              </>
            ) : (
              <>
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.tapToCaptureText}>Tap to capture</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Back Side */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Back side</Text>
          <TouchableOpacity 
            style={[styles.uploadBox, backUploaded && styles.uploadBoxSuccess]}
            onPress={() => setBackUploaded(!backUploaded)}
          >
            {backUploaded ? (
              <>
                <View style={styles.iconCircleSuccess}>
                  <Text style={styles.iconSuccess}>✓</Text>
                </View>
                <Text style={styles.uploadedText}>POD_back.jpg uploaded</Text>
              </>
            ) : (
              <>
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.tapToCaptureText}>Tap to capture</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>POD must be uploaded within 24 hours of delivery.</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={onComplete}>
          <Text style={styles.submitBtnText}>Continue to Documents</Text>
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
    padding: 24,
  },
  uploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 12,
  },
  uploadBox: {
    height: 140,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBoxSuccess: {
    borderColor: '#22c55e', // Green
    backgroundColor: '#f0fdf4', // Light green
  },
  cameraIcon: {
    fontSize: 32,
    color: '#94a3b8',
    marginBottom: 8,
  },
  tapToCaptureText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  iconCircleSuccess: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconSuccess: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadedText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#15803d', // Dark green
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  submitBtn: {
    backgroundColor: '#1e40af', // Navy blue
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
