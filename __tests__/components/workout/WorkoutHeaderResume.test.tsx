// __tests__/components/workout/WorkoutHeaderResumeComponent.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from '../../../components/workout/WorkoutHeaderResume';
import { calculateDaysDifferenceNow } from '@/utils/date';

jest.mock('../../../styles.css', () => ({}));

jest.mock('@/utils/date', () => ({
  calculateDaysDifferenceNow: jest.fn(),
}));

describe('WorkoutHeaderResumeComponent', () => {
  const mockProps: WorkoutHeaderResume = {
    workoutName: 'Test Workout',
    workoutDate: new Date('2024-10-10'),
    workoutTime: 30,
    workoutVolume: 1500,
    workoutSeries: 3,
  };

  beforeEach(() => {
    (calculateDaysDifferenceNow as jest.Mock).mockClear(); // Limpia los mocks antes de cada prueba
  });

  it('should render workout name correctly', () => {
    (calculateDaysDifferenceNow as jest.Mock).mockReturnValue(3); // Simula el retorno de la función

    const { getByText } = render(
      <WorkoutHeaderResumeComponent {...mockProps} />
    );

    expect(getByText('Test Workout')).toBeTruthy();
    expect(getByText('hace 3 días')).toBeTruthy();
  });

  it('should render workout time, volume, and series correctly', () => {
    (calculateDaysDifferenceNow as jest.Mock).mockReturnValue(1); // Simula el retorno de la función

    const { getByText } = render(
      <WorkoutHeaderResumeComponent {...mockProps} />
    );

    expect(getByText('Tiempo')).toBeTruthy();
    expect(getByText('30 min')).toBeTruthy();
    expect(getByText('Volumen')).toBeTruthy();
    expect(getByText('1500 Kg')).toBeTruthy();
    expect(getByText('Series')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('should call calculateDaysDifferenceNow with the correct date', () => {
    render(<WorkoutHeaderResumeComponent {...mockProps} />);

    expect(calculateDaysDifferenceNow).toHaveBeenCalledWith(
      mockProps.workoutDate
    );
  });
});
