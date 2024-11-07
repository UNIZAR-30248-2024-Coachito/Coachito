import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../screens/App';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

jest.mock('../../styles.css', () => ({}));

describe('App Navigation', () => {
  test('only active tab screens are rendered', async () => {
    const { getByText, queryByText } = render(
      <GluestackUIProvider mode="dark">
        <App />
      </GluestackUIProvider>
    );

    // Verifica que Dashboard esté visible al inicio
    fireEvent.press(getByText('Dashboard'));
    expect(getByText('Dashboard')).toBeTruthy();
    expect(queryByText('Routine')).toBeNull();
    expect(queryByText('Profile')).toBeNull();
    expect(queryByText('Exercises')).toBeNull();
    expect(queryByText('AddExercise')).toBeNull();
    expect(queryByText('AddRoutine')).toBeNull();
    expect(queryByText('DetailsRoutine')).toBeNull();
    expect(queryByText('EditRoutine')).toBeNull();
    expect(queryByText('AddExerciseEdit')).toBeNull();
    expect(queryByText('StartWorkout')).toBeNull();
    expect(queryByText('DetailsWorkout')).toBeNull();
    expect(queryByText('DetailsEsercise')).toBeNull();

    // Simula la navegación a la pestaña Routine
    fireEvent.press(getByText('Routine'));
    expect(getByText('Routine')).toBeTruthy();
    expect(queryByText('Dashboard')).toBeNull();
    expect(queryByText('Profile')).toBeNull();
    expect(queryByText('Exercises')).toBeNull();
    expect(queryByText('AddExercise')).toBeNull();
    expect(queryByText('AddRoutine')).toBeNull();
    expect(queryByText('DetailsRoutine')).toBeNull();
    expect(queryByText('EditRoutine')).toBeNull();
    expect(queryByText('AddExerciseEdit')).toBeNull();
    expect(queryByText('StartWorkout')).toBeNull();
    expect(queryByText('DetailsWorkout')).toBeNull();
    expect(queryByText('DetailsEsercise')).toBeNull();

    // Simula la navegación a la pestaña Profile
    fireEvent.press(getByText('Profile'));
    expect(getByText('Profile')).toBeTruthy();
    expect(queryByText('Routine')).toBeNull();
    expect(queryByText('Dashboard')).toBeNull();
    expect(queryByText('Exercises')).toBeNull();
    expect(queryByText('AddExercise')).toBeNull();
    expect(queryByText('AddRoutine')).toBeNull();
    expect(queryByText('DetailsRoutine')).toBeNull();
    expect(queryByText('EditRoutine')).toBeNull();
    expect(queryByText('AddExerciseEdit')).toBeNull();
    expect(queryByText('StartWorkout')).toBeNull();
    expect(queryByText('DetailsWorkout')).toBeNull();
    expect(queryByText('DetailsEsercise')).toBeNull();

    // Simula la navegación a la pestaña Exercises
    fireEvent.press(getByText('Exercises'));
    expect(getByText('Exercises')).toBeTruthy();
    expect(queryByText('Profile')).toBeNull();

    // Simula la navegación a la pestaña AddExercise
    fireEvent.press(getByText('AddExercise'));
    expect(getByText('AddExercise')).toBeTruthy();
    expect(queryByText('Exercises')).toBeNull();

    // Simula la navegación a la pestaña AddRoutine
    fireEvent.press(getByText('AddRoutine'));
    expect(getByText('AddRoutine')).toBeTruthy();
    expect(queryByText('AddExercise')).toBeNull();
  });
});
