import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CustomChartButtons from '@/components/shared/CustomChartButtons';

jest.mock('../../../styles.css', () => ({}));

const sampleData = [
  {
    dataPoints: [
      { value: 10, label: 'Jan' },
      { value: 20, label: 'Feb' },
      { value: 30, label: 'Mar' },
    ],
    dataTotal: '60',
  },
  {
    dataPoints: [
      { value: 15, label: 'Apr' },
      { value: 25, label: 'May' },
      { value: 35, label: 'Jun' },
    ],
    dataTotal: '75',
  },
];

const sampleButtons = ['Button 1', 'Button 2'];

describe('CustomChartButtons', () => {
  it('debería llamar a onDataChartPointsChange y onDataChartTotalChange cuando se presiona un botón', () => {
    const onDataChartPointsChange = jest.fn();
    const onDataChartTotalChange = jest.fn();

    render(
      <CustomChartButtons
        buttons={sampleButtons}
        data={sampleData}
        onDataChartPointsChange={onDataChartPointsChange}
        onDataChartTotalChange={onDataChartTotalChange}
      />
    );

    const button1 = screen.getByText('Button 1');
    fireEvent.press(button1);

    expect(onDataChartPointsChange).toHaveBeenCalledWith(
      sampleData[0].dataPoints
    );
    expect(onDataChartTotalChange).toHaveBeenCalledWith(
      sampleData[0].dataTotal
    );

    const button2 = screen.getByText('Button 2');
    fireEvent.press(button2);

    expect(onDataChartPointsChange).toHaveBeenCalledWith(
      sampleData[1].dataPoints
    );
    expect(onDataChartTotalChange).toHaveBeenCalledWith(
      sampleData[1].dataTotal
    );
  });
});
