import CustomBarChart from '@/components/shared/CustomBarChart';
import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-gifted-charts', () => ({
  BarChart: jest.fn(() => <div>Mock BarChart</div>),
}));

describe('CustomBarChart', () => {
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

  it('debería renderizar el gráfico y los botones correctamente', () => {
    const { getByTestId, getByText } = render(
      <CustomBarChart data={sampleData} buttons={sampleButtons} />
    );

    expect(getByText('60')).toBeTruthy();
    expect(getByText('Últimos 3 meses')).toBeTruthy();
    expect(getByTestId('bar-chart')).toBeTruthy();
    sampleButtons.forEach((buttonText) => {
      expect(getByText(buttonText)).toBeTruthy();
    });
  });

  it('debería actualizar los puntos del gráfico cuando se actualicen los datos', () => {
    const { rerender, getByText } = render(
      <CustomBarChart data={sampleData} buttons={sampleButtons} />
    );

    expect(getByText('60')).toBeTruthy();

    const newData = [
      {
        dataPoints: [
          { value: 50, label: 'Apr' },
          { value: 60, label: 'May' },
          { value: 70, label: 'Jun' },
        ],
        dataTotal: '180',
      },
    ];

    rerender(<CustomBarChart data={newData} buttons={sampleButtons} />);

    expect(getByText('180')).toBeTruthy();
  });
});
