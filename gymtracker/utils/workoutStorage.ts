import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WorkoutEntry {
  id: string;
  exercise: string;
  reps: string;
  weight: string;
  notes: string;
  date: string;
}

export const saveWorkoutEntry = async (entry: Omit<WorkoutEntry, 'id' | 'date'>): Promise<void> => {
  try {
    const workoutEntry: WorkoutEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };

    const existingHistory = await AsyncStorage.getItem('workoutHistory');
    const history: WorkoutEntry[] = existingHistory ? JSON.parse(existingHistory) : [];
    
    history.push(workoutEntry);
    await AsyncStorage.setItem('workoutHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error saving workout entry:', error);
    throw error;
  }
};

export const loadWorkoutHistory = async (): Promise<WorkoutEntry[]> => {
  try {
    const history = await AsyncStorage.getItem('workoutHistory');
    if (history) {
      const parsedHistory: WorkoutEntry[] = JSON.parse(history);
      // Sort by date, most recent first
      return parsedHistory.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    return [];
  } catch (error) {
    console.error('Error loading workout history:', error);
    return [];
  }
};
