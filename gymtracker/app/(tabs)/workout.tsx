import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function WorkoutScreen() {
  const router = useRouter();

  const navigateToWorkout = (workoutType: string) => {
    router.navigate(`/workouts/${workoutType}` as any);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Choose Your Workout</ThemedText>
        <ThemedText style={styles.subtitle}>Select a workout type to get started</ThemedText>
      </ThemedView>

      <ThemedView style={styles.workoutButtonsContainer}>
        <TouchableOpacity 
          style={styles.workoutButton}
          onPress={() => navigateToWorkout('push')}
        >
          <IconSymbol size={48} name="figure.strengthtraining.traditional" color="#007AFF" />
          <ThemedText type="subtitle" style={styles.workoutButtonTitle}>Push</ThemedText>
          <ThemedText style={styles.workoutButtonDescription}>
            Chest, Shoulders, Triceps
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.workoutButton}
          onPress={() => navigateToWorkout('pull')}
        >
          <IconSymbol size={48} name="arrow.down.circle" color="#007AFF" />
          <ThemedText type="subtitle" style={styles.workoutButtonTitle}>Pull</ThemedText>
          <ThemedText style={styles.workoutButtonDescription}>
            Back, Biceps, Rear Delts
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.workoutButton}
          onPress={() => navigateToWorkout('legs')}
        >
          <IconSymbol size={48} name="figure.walk" color="#007AFF" />
          <ThemedText type="subtitle" style={styles.workoutButtonTitle}>Legs</ThemedText>
          <ThemedText style={styles.workoutButtonDescription}>
            Quads, Hamstrings, Glutes, Calves
          </ThemedText>
        </TouchableOpacity>
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
  header: {
    marginBottom: 40,
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  workoutButtonsContainer: {
    flex: 1,
    gap: 20,
  },
  workoutButton: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  workoutButtonTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  workoutButtonDescription: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
