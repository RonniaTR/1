import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Uygulama açılınca doğrudan canlı Türkiye haritası (harita = menü).
      router.replace('/harita');
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🌍</Text>
        </View>
        <Text style={styles.title}>KPSS Coğrafya</Text>
        <Text style={styles.subtitle}>Coğrafyayı yaşatan uygulama</Text>
        <ActivityIndicator size="large" color="#4f8f56" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e343c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { alignItems: 'center' },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(79,143,86,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: { fontSize: 52 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#f4f7f2', marginBottom: 8, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: '#9db7a4', marginBottom: 48 },
  loader: { marginTop: 20 },
});
