import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import CustomAreaChart, {
  DataChartProps,
} from '@/components/shared/CustomAreaChart';

jest.mock('../../../styles.css', () => ({}));

jest.mock('react-native-gifted-charts', () => ({
  LineChart: () => <div>Mock LineChart</div>,
}));

describe('CustomAreaChart', () => {
  const sampleData = [
    {
      dataPoints: [
        { value: 10, label: 'Jan' },
        { value: 20, label: 'Feb' },
        { value: 30, label: 'Mar' },
      ],
      dataTotal: '60',
    },
  ];
  const sampleButtons = ['Button 1', 'Button 2', 'Button 3'];

  beforeEach(() => {
    Dimensions.get = jest.fn().mockReturnValue({ width: 400 });
  });

  it('debería renderizar el gráfico y los botones correctamente', () => {
    render(<CustomAreaChart data={sampleData} buttons={sampleButtons} />);

    expect(screen.getByText('60')).toBeTruthy();
    expect(screen.getByText('Últimos 3 meses')).toBeTruthy();
    expect(screen.getByTestId('area-chart')).toBeTruthy();
    sampleButtons.forEach((button) => {
      expect(screen.getByText(button)).toBeTruthy();
    });
  });

  it('debería actualizar los puntos del gráfico cuando se actualicen los datos', () => {
    const { rerender } = render(
      <CustomAreaChart data={sampleData} buttons={sampleButtons} />
    );

    expect(screen.getByText('60')).toBeTruthy();

    const updatedData: DataChartProps[] = [
      {
        dataPoints: [
          { value: 50, label: 'April' },
          { value: 60, label: 'May' },
          { value: 70, label: 'June' },
        ],
        dataTotal: '180',
      },
    ];

    rerender(<CustomAreaChart data={updatedData} buttons={sampleButtons} />);

    expect(screen.getByText('180')).toBeTruthy();
  });
});
