import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import TripDetailsScreen from './src/screens/TripDetailsScreen';

export default function App() {
  const [authState, setAuthState] = useState<{ token: string; user: any } | null>(null);
  const [currentScreen, setCurrentScreen] = useState<'Home' | 'TripDetails'>('Home');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const handleLogin = (data: any) => {
    setAuthState({ token: data.token, user: data.user });
    setCurrentScreen('Home');
  };

  const handleSelectTrip = (trip: any) => {
    setSelectedTrip(trip);
    setCurrentScreen('TripDetails');
  };

  const handleBackToHome = () => {
    setSelectedTrip(null);
    setCurrentScreen('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {!authState ? (
        <LoginScreen onLogin={handleLogin} />
      ) : currentScreen === 'Home' ? (
        <DriverHomeScreen authState={authState} onSelectTrip={handleSelectTrip} />
      ) : currentScreen === 'TripDetails' && selectedTrip ? (
        <TripDetailsScreen trip={selectedTrip} authState={authState} onBack={handleBackToHome} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
