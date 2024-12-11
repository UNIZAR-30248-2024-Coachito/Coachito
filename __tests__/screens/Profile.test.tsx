import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Profile from '@/screens/Profile';
import { useFetchUserWorkouts } from '@/hooks/userHook';
import { useRoute } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/userHook', () => ({
  useFetchUserWorkouts: jest.fn(),
}));

jest.mock('../../components/shared/CustomBarChart', () => 'CustomBarChart');

jest.mock('@legendapp/motion', () => ({
  Motion: {
    View: jest.fn(),
  },
  AnimatePresence: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    mergeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
    multiMerge: jest.fn(),
  };
});

describe('Profile', () => {
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
      expect(getByText('5 entrenos realizados')).toBeTruthy();
    });
  });
});
