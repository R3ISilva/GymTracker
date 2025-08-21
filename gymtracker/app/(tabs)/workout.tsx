import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { saveWorkoutEntry } from '@/utils/workoutStorage';
import exercisesData from '../../Exercises.json';

interface Exercise {
  name: string;
  video: string;
}

interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}

export default function WorkoutScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setWorkouts(exercisesData as Workout[]);
  }, []);

  const handleWorkoutSelect = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentExerciseIndex(0);
    setReps('');
    setWeight('');
    setNotes('');
  };

  const resetWorkoutState = () => {
    setSelectedWorkout(null);
    setCurrentExerciseIndex(0);
    setReps('');
    setWeight('');
    setNotes('');
  };

  const handleNext = async () => {
    if (!selectedWorkout) return;

    const currentExercise = selectedWorkout.exercises[currentExerciseIndex];
    
    // Save the current exercise data if reps and weight are provided
    if (reps.trim() && weight.trim()) {
      try {
        await saveWorkoutEntry({
          exercise: currentExercise.name,
          reps: reps.trim(),
          weight: weight.trim(),
          notes: notes.trim(),
        });
      } catch {
        Alert.alert('Error', 'Failed to save workout entry');
        return;
      }
    }

    // Move to next exercise or finish workout
    if (currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setReps('');
      setWeight('');
      setNotes('');
    } else {
      // Workout completed: reset state so next visit starts fresh, then navigate
      resetWorkoutState();
      router.push('/(tabs)');
    }
  };

  const handleSkip = () => {
    if (!selectedWorkout) return;

    if (currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setReps('');
      setWeight('');
      setNotes('');
    } else {
  // Last exercise, reset and go to stats
  resetWorkoutState();
      router.push('/(tabs)');
    }
  };

  const handleBack = () => {
    resetWorkoutState();
  };

  if (selectedWorkout) {
    const currentExercise = selectedWorkout.exercises[currentExerciseIndex];
    const isLastExercise = currentExerciseIndex === selectedWorkout.exercises.length - 1;

    return (
      <ThemedView style={styles.container}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ThemedText style={styles.backText}>← Back</ThemedText>
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.exerciseContainer}>
          <ThemedView style={styles.exerciseHeader}>
            <ThemedText type="title" style={styles.exerciseTitle}>
              {currentExercise.name}
            </ThemedText>
            <ThemedText style={styles.exerciseCounter}>
              Exercise {currentExerciseIndex + 1} of {selectedWorkout.exercises.length}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.gifContainer}>
            <Image
              source={{ uri: currentExercise.video }}
              style={styles.exerciseGif}
              resizeMode="contain"
            />
          </ThemedView>

          <ThemedView style={styles.inputContainer}>
            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Reps</ThemedText>
              <TextInput
                style={styles.input}
                value={reps}
                onChangeText={setReps}
                placeholder="Enter reps"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Weight (kg)</ThemedText>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </ThemedView>

            <ThemedView style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Notes (optional)</ThemedText>
              <TextInput
                style={[styles.input, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes..."
                placeholderTextColor="#666"
                multiline
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}
            >
              <ThemedText style={styles.skipButtonText}>Skip</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={handleNext}
            >
              <ThemedText style={styles.nextButtonText}>
                {isLastExercise ? 'Finish Workout' : 'Next Exercise'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </ThemedView>
    );
  }

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
            onPress={() => handleWorkoutSelect(workout)}
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
  backButton: {
    alignSelf: 'flex-start',
    padding: 12,
    marginBottom: 16,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseContainer: {
    paddingBottom: 20,
  },
  exerciseHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  exerciseTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  exerciseCounter: {
    color: '#999',
    fontSize: 16,
  },
  gifContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
  },
  exerciseGif: {
    width: 300,
    height: 200,
    borderRadius: 12,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#333',
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
