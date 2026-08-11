import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ authState, onNavigate }: { authState: any, onNavigate: (screen: string) => void }) {
  const driverName = authState?.user?.name || "Rajesh Kumar";
  const initials = driverName.split(' ').map((n: string) => n[0]).join('').substring(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Blue Header Area */}
        <View style={styles.headerArea}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{driverName}</Text>
          <Text style={styles.subtitle}>Driver · TransitFlow Fleet</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ 4.7 · 312 trips</Text>
          </View>
        </View>

        <View style={styles.list}>
          {/* Earnings & Payments link - Custom addition for navigation */}
          <TouchableOpacity style={[styles.listItem, { borderColor: '#1d4ed8', borderWidth: 2 }]} onPress={() => onNavigate('Payments')}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>💰</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>Earnings & Payments</Text>
              <Text style={styles.itemValue}>View settlement status</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.listItem}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>📞</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>MOBILE</Text>
              <Text style={styles.itemValue}>+91 98765 43210</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>🚚</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>ASSIGNED VEHICLE</Text>
              <Text style={styles.itemValue}>DL01 CE 8890</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>💳</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>LICENSE</Text>
              <Text style={styles.itemValue}>DL-0420 · valid till 2029</Text>
            </View>
          </View>

          <View style={styles.listItem}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>✅</Text>
            </View>
            <View style={styles.itemContent}>
              <Text style={styles.itemLabel}>KYC STATUS</Text>
              <Text style={[styles.itemValue, { color: '#22c55e' }]}>Verified</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Home')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Home')}>
          <Text style={styles.navIcon}>🚚</Text>
          <Text style={styles.navText}>Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => onNavigate('Notifications')}>
          <Text style={styles.navIcon}>🔔</Text>
          <Text style={styles.navText}>Alerts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navText, styles.navActive]}>Profile</Text>
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
  scroll: {
    paddingBottom: 100,
  },
  headerArea: {
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#60a5fa',
  },
  avatarText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: '700',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#93c5fd',
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 2,
  },
  itemIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemIcon: {
    fontSize: 24,
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  itemValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  chevron: {
    fontSize: 24,
    color: '#94a3b8',
  },
  bottomNav: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
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
