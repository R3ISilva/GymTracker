import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

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

export default function HomeScreen() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkoutHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('workoutHistory');
      if (history) {
        const parsedHistory: WorkoutEntry[] = JSON.parse(history);
        // Sort by date, most recent first
        const sortedHistory = parsedHistory.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setWorkoutHistory(sortedHistory);
      }
    } catch (error) {
      console.error('Error loading workout history:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWorkoutHistory();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkoutHistory();
    }, [])
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderWorkoutEntry = (entry: WorkoutEntry) => (
    <ThemedView key={entry.id} style={styles.workoutEntry}>
      <ThemedView style={styles.workoutHeader}>
        <ThemedText type="subtitle" style={styles.exerciseName}>
          {entry.exercise}
        </ThemedText>
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

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Workout Stats</ThemedText>
        <ThemedText style={styles.subtitle}>
          {workoutHistory.length} total sets logged
        </ThemedText>
      </ThemedView>

      {workoutHistory.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No workouts logged yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Go to the Workout tab to start tracking your workouts
          </ThemedText>
        </ThemedView>
      ) : (
        workoutHistory.map(renderWorkoutEntry)
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
    marginBottom: 8,
  },
  subtitle: {
    color: '#999',
    fontSize: 16,
  },
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
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
