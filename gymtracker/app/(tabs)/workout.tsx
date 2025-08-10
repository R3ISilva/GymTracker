import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import exercisesData from '../../Exercises.json';

export default function WorkoutScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    setWorkouts(exercisesData);
  }, []);

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
        {workouts.map((workout) => (
          <TouchableOpacity 
            key={workout.id}
            style={styles.workoutButton}
            onPress={() => navigateToWorkout(workout.name.toLowerCase())}
          >
            <ThemedText type="subtitle" style={styles.workoutButtonTitle}>
              {workout.name}
            </ThemedText>
            <ThemedText style={styles.workoutButtonDescription}>
              {workout.description}
            </ThemedText>
          </TouchableOpacity>
        ))}
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
