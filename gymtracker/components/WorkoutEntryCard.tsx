import { WorkoutEntry } from '@/utils/workoutStorage';
import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface WorkoutEntryCardProps {
  entry: WorkoutEntry;
  showExerciseName?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function WorkoutEntryCard({ entry, showExerciseName = false, style }: WorkoutEntryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ThemedView style={[styles.workoutEntry, style]}>
      <ThemedView style={[styles.workoutHeader, !showExerciseName && { justifyContent: 'flex-end' }]}>
        {showExerciseName && (
          <ThemedText type="subtitle" style={styles.exerciseName}>
            {entry.exercise}
          </ThemedText>
        )}
        <ThemedText style={styles.dateText}>
          {formatDate(entry.date)}
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.workoutDetails}>
        <ThemedView style={styles.statGroup}>
          <ThemedText style={styles.statValue}>{entry.reps}</ThemedText>
          <ThemedText style={styles.statLabel}>reps</ThemedText>
        </ThemedView>
        
        <ThemedText style={styles.separator}>×</ThemedText>
        
        <ThemedView style={styles.statGroup}>
          <ThemedText style={styles.statValue}>{entry.weight}</ThemedText>
          <ThemedText style={styles.statLabel}>kg</ThemedText>
        </ThemedView>
      </ThemedView>
      
      {entry.notes ? (
        <ThemedText style={styles.notesText}>{entry.notes}</ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  workoutEntry: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  dateText: {
    color: '#999',
    fontSize: 14,
  },
  workoutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  statGroup: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
  },
  notesText: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
});
