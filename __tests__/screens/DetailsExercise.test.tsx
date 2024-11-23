import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import DetailsExercise from '@/screens/DetailsExercise';
import { useRoute } from '@react-navigation/native';
import { useFetchExerciseDetails } from '@/hooks/exerciseHook';
import { Alert } from 'react-native';

jest.mock('react-native-gifted-charts', () => ({
  LineChart: jest.fn(() => <></>),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
}));

jest.mock('@/hooks/exerciseHook', () => ({
  useFetchExerciseDetails: jest.fn(),
}));

Alert.alert = jest.fn();

describe('DetailsExercise', () => {
  const mockExerciseDetails = {
    id: 1,
    name: 'Flexiones',
    imageUrl: 'https://example.com/image.png',
    primaryMuscleGroup: 'Pectorales',
    higherWeight: 100,
    best1rm: 120,
    bestSerieVolume: { reps: 10, weight: 80 },
    bestTotalVolume: 800,
    serieRecords: [
      { reps: 5, personalBest: 70 },
      { reps: 10, personalBest: 80 },
    ],
    dataPoints: [
      {
        dataTotal: '20.00 kg',
        dataPoints: [
          {
            label: '05/11',
            value: 5.0,
          },
          {
            label: '07/10',
            value: 5.0,
          },
          {
            label: '22/10',
            value: 10.0,
          },
        ],
      },
      {
        dataTotal: '26.33 kg',
        dataPoints: [
          {
            label: '05/11',
            value: 6.33,
          },
          {
            label: '07/10',
            value: 6.67,
          },
          {
            label: '22/10',
            value: 13.33,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { exerciseId: 1 },
    });

    (useFetchExerciseDetails as jest.Mock).mockResolvedValue({
      data: mockExerciseDetails,
      error: null,
    });
  });

  it('debería renderizar el nombre del ejercicio y los valores de los registros correctamente', async () => {
    const { getByText, getAllByText } = render(<DetailsExercise />);

    await waitFor(() => {
      expect(getByText('Flexiones')).toBeTruthy();
      expect(getAllByText('Mayor Peso')[1]).toBeTruthy();
      expect(getByText('120 kg')).toBeTruthy();
      expect(getByText('Mejor 1RM')).toBeTruthy();
      expect(getByText('120 kg')).toBeTruthy();
      expect(getByText('Mejor volumen (serie)')).toBeTruthy();
      expect(getByText('10 x 80 kg')).toBeTruthy();
      expect(getByText('Mejor volumen total')).toBeTruthy();
      expect(getByText('800 kg')).toBeTruthy();
    });
  });

  it('debería renderizar los registros de serie correctamente', async () => {
    const { getByText } = render(<DetailsExercise />);

    await waitFor(() => {
      expect(getByText('Reps')).toBeTruthy();
      expect(getByText('Mejor Marca Personal')).toBeTruthy();
      expect(getByText('5')).toBeTruthy();
      expect(getByText('70 kg')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
      expect(getByText('80 kg')).toBeTruthy();
    });
  });

  it('debería mostrar un error si la obtención de la información de los ejercicios falla', async () => {
    (useFetchExerciseDetails as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: 'Some error',
    });

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    render(<DetailsExercise />);

    await waitFor(() =>
      expect(alertSpy).toHaveBeenCalledWith(
        '',
        'Se ha producido un error al obtener la información del ejercicio.',
        [{ text: 'OK' }]
      )
    );

    alertSpy.mockRestore();
  });
});
