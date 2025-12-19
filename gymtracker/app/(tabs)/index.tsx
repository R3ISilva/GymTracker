import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ExerciseGraph } from '@/components/ExerciseGraph';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { WorkoutEntry, loadWorkoutHistory } from '@/utils/workoutStorage';

export default function HomeScreen() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadWorkoutHistoryData = async () => {
    try {
      const history = await loadWorkoutHistory();
      setWorkoutHistory(history);
    } catch (error) {
      console.error('Error loading workout history:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWorkoutHistoryData();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkoutHistoryData();
    }, [])
  );

  const byExercise = useMemo(() => {
    const map = new Map<string, WorkoutEntry[]>();
    for (const e of workoutHistory) {
      const arr = map.get(e.exercise) ?? [];
      arr.push(e);
      map.set(e.exercise, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [workoutHistory]);

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

  const renderGraphs = () => (
    <>
      {byExercise.map(([name, entries]) => (
        <ExerciseGraph key={name} title={name} entries={entries} />
      ))}
    </>
  );

  const handleClearData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('workoutHistory');
      await loadWorkoutHistoryData();
    } catch (e) {
      console.error('Error clearing workout history:', e);
    }
  }, []);

  const handleImportData = useCallback(async () => {
    try {
      const data: WorkoutEntry[] = require('../../data/workoutHistory-2026.json');
      await AsyncStorage.setItem('workoutHistory', JSON.stringify(data));
      await loadWorkoutHistoryData();
    } catch (e) {
      console.error('Error importing workout history:', e);
    }
  }, []);

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
        <View style={styles.buttonRow}>
          <Pressable onPress={handleImportData} style={({ pressed }) => [styles.actionButton, pressed && styles.buttonPressed]}> 
            <ThemedText style={styles.buttonText}>Import 2026 JSON</ThemedText>
          </Pressable>
          <Pressable onPress={handleClearData} style={({ pressed }) => [styles.actionButton, styles.destructiveButton, pressed && styles.buttonPressed]}> 
            <ThemedText style={styles.buttonText}>Clear Data</ThemedText>
          </Pressable>
        </View>
      </ThemedView>

      {workoutHistory.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No workouts logged yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Go to the Workout tab to start tracking your workouts
          </ThemedText>
        </ThemedView>
      ) : (
        <>
          {renderGraphs()}
          <ThemedView style={styles.separatorLine} />
          {workoutHistory.map(renderWorkoutEntry)}
        </>
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  destructiveButton: {
    borderColor: '#553333',
    backgroundColor: '#332222',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  separatorLine: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 12,
  },
});
