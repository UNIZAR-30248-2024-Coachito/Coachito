import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Profile from '@/screens/Profile';
import { useFetchUserWorkouts } from '@/hooks/userHook';
import { useRoute } from '@react-navigation/native';

jest.mock('../../styles.css', () => ({}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/userHook', () => ({
  useFetchUserWorkouts: jest.fn(),
}));

jest.mock('../../components/shared/CustomBarChart', () => 'CustomBarChart');

describe('Profile Screen', () => {
  const mockUseRoute = useRoute as jest.Mock;
  const mockUseFetchUserWorkouts = useFetchUserWorkouts as jest.Mock;

  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { userId: '123' } });
  });

  it('debería hacer fetch de los datos de usuario y renderizar los detalles correctamente', async () => {
    const mockData = {
      username: 'testuser',
      workoutsCount: 5,
      workouts: [
        {
          workoutId: 1,
          duration: '01:30:00',
          repsCount: 20,
          volumen: 100,
          created_at: '2023-11-01',
        },
        {
          workoutId: 2,
          duration: '00:45:00',
          repsCount: 15,
          volumen: 150,
          created_at: '2023-11-02',
        },
      ],
    };

    mockUseFetchUserWorkouts.mockResolvedValue({ data: mockData, error: null });

    const { getByText } = render(<Profile />);

    await waitFor(() => {
      expect(getByText('testuser')).toBeTruthy();
      expect(getByText('5 entrenos realizados')).toBeTruthy();
    });
  });
});
