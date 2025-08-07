import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import { 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface WorkoutEntry {
  id: string;
  exercise: string;
  reps: string;
  weight: string;
  notes: string;
  date: string;
}

interface ExerciseFormData {
  reps: string;
  weight: string;
  notes: string;
}

const EXERCISES_WITH_VIDEO_SRC = {
  "Squats": "https://fitnessprogramer.com/wp-content/uploads/2021/02/BARBELL-SQUAT.gif",
  "Romanian deadlifts": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Romanian-Deadlift.gif",
  "Leg press": "https://fitnessprogramer.com/wp-content/uploads/2015/11/Leg-Press.gif",
  "Calfraise": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Calf-Raise.gif"
};

export default function LegScreen() {
  const [formData, setFormData] = useState<{ [key: string]: ExerciseFormData }>({});

  useEffect(() => {
    loadLastWorkoutData();
  }, []);

  const loadLastWorkoutData = async () => {
    try {
      const workoutHistory = await AsyncStorage.getItem('workoutHistory');
      if (workoutHistory) {
        const history: WorkoutEntry[] = JSON.parse(workoutHistory);
        const lastWorkouts: { [key: string]: ExerciseFormData } = {};
        
        Object.keys(EXERCISES_WITH_VIDEO_SRC).forEach(exercise => {
          const lastEntry = history
            .filter(entry => entry.exercise === exercise)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          
          if (lastEntry) {
            lastWorkouts[exercise] = {
              reps: lastEntry.reps,
              weight: lastEntry.weight,
              notes: lastEntry.notes
            };
          } else {
            lastWorkouts[exercise] = { reps: '', weight: '', notes: '' };
          }
        });
        
        setFormData(lastWorkouts);
      } else {
        // Initialize empty form data
        const emptyFormData: { [key: string]: ExerciseFormData } = {};
        Object.keys(EXERCISES_WITH_VIDEO_SRC).forEach(exercise => {
          emptyFormData[exercise] = { reps: '', weight: '', notes: '' };
        });
        setFormData(emptyFormData);
      }
    } catch (error) {
      console.error('Error loading workout data:', error);
    }
  };

  const updateFormData = (exercise: string, field: keyof ExerciseFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [exercise]: {
        ...prev[exercise],
        [field]: value
      }
    }));
  };

  const saveWorkout = async (exercise: string) => {
    const data = formData[exercise];
    if (!data.reps || !data.weight) {
      Alert.alert('Error', 'Please fill in reps and weight');
      return;
    }

    try {
      const workoutEntry: WorkoutEntry = {
        id: Date.now().toString(),
        exercise,
        reps: data.reps,
        weight: data.weight,
        notes: data.notes,
        date: new Date().toISOString()
      };

      const existingHistory = await AsyncStorage.getItem('workoutHistory');
      const history: WorkoutEntry[] = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(workoutEntry);
      
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(history));
      Alert.alert('Success', 'Workout saved!');
    } catch (error) {
      console.error('Error saving workout:', error);
      Alert.alert('Error', 'Failed to save workout');
    }
  };

  const renderExercise = (exercise: string, videoSrc: string) => (
    <ThemedView key={exercise} style={styles.exerciseContainer}>
      <ThemedText type="subtitle" style={styles.exerciseTitle}>{exercise}</ThemedText>
      
      <Image 
        source={{ uri: videoSrc }} 
        style={styles.exerciseImage}
        contentFit="cover"
      />
      
      <ThemedView style={styles.formContainer}>
        <ThemedView style={styles.inputRow}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Reps</ThemedText>
            <TextInput
              style={styles.input}
              value={formData[exercise]?.reps || ''}
              onChangeText={(value) => updateFormData(exercise, 'reps', value)}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </ThemedView>
          
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Weight (lbs)</ThemedText>
            <TextInput
              style={styles.input}
              value={formData[exercise]?.weight || ''}
              onChangeText={(value) => updateFormData(exercise, 'weight', value)}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.inputGroup}>
          <ThemedText style={styles.inputLabel}>Notes</ThemedText>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={formData[exercise]?.notes || ''}
            onChangeText={(value) => updateFormData(exercise, 'notes', value)}
            placeholder="Optional notes..."
            multiline
            placeholderTextColor="#666"
          />
        </ThemedView>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => saveWorkout(exercise)}
        >
          <ThemedText style={styles.saveButtonText}>Save Set</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Leg Workout</ThemedText>
      </ThemedView>
      
      {Object.entries(EXERCISES_WITH_VIDEO_SRC).map(([exercise, videoSrc]) =>
        renderExercise(exercise, videoSrc)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  exerciseContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  exerciseTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  exerciseImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  formContainer: {
    gap: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
