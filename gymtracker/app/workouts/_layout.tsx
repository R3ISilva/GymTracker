import { Stack } from 'expo-router';

export default function WorkoutsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="push"
        options={{
          title: 'Push Workout',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="pull"
        options={{
          title: 'Pull Workout',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="legs"
        options={{
          title: 'Legs Workout',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}
