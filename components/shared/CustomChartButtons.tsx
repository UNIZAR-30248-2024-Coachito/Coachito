import React, { useState } from 'react';
import { Button } from '../ui/button';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { DataChartProps, DataPoint } from './CustomAreaChart';
import { ScrollView } from '../ui/scroll-view';

export interface CustomChartButtonsProps {
  names: string[];
  data: DataChartProps[];
  onDataChartPointsChange: (points: DataPoint[]) => void;
  onDataChartTotalChange: (total: string) => void;
}

const CustomChartButtons: React.FC<CustomChartButtonsProps> = ({
  names,
  data,
  onDataChartPointsChange,
  onDataChartTotalChange,
}) => {
  const [activeButton, setActiveButton] = useState('button1');

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack className="justify-between gap-4">
        <Button
          className={
            activeButton === 'button1'
              ? 'rounded-lg bg-blue-500'
              : 'rounded-lg bg-background-50'
          }
          onPress={() => {
            setActiveButton('button1');
            onDataChartPointsChange(data[0].dataPoints);
            onDataChartTotalChange(data[0].dataTotal);
          }}
        >
          <Text className="text-white">{names[0]}</Text>
        </Button>
        <Button
          className={
            activeButton === 'button2'
              ? 'rounded-lg bg-blue-500'
              : 'rounded-lg bg-background-50'
          }
          onPress={() => {
            setActiveButton('button2');
            onDataChartPointsChange(data[1].dataPoints);
            onDataChartTotalChange(data[1].dataTotal);
          }}
        >
          <Text className="text-white">{names[1]}</Text>
        </Button>
        <Button
          className={
            activeButton === 'button3'
              ? 'rounded-lg bg-blue-500'
              : 'rounded-lg bg-background-50'
          }
          onPress={() => {
            setActiveButton('button3');
            onDataChartPointsChange(data[2].dataPoints);
            onDataChartTotalChange(data[2].dataTotal);
          }}
        >
          <Text className="text-white">{names[2]}</Text>
        </Button>
      </HStack>
    </ScrollView>
  );
};

export default CustomChartButtons;
