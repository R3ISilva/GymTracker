import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function FoodScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <IconSymbol size={80} name="fork.knife" color="#666" />
        <ThemedText type="title" style={styles.title}>Food Tracking</ThemedText>
        <ThemedText style={styles.subtitle}>Coming Soon</ThemedText>
        <ThemedText style={styles.description}>
          This feature will help you track your nutrition and calories to complement your workout routine.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#999',
    fontSize: 18,
    fontWeight: '500',
  },
  description: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
});
