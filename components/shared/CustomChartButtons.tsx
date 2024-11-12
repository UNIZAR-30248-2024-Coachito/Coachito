import React, { useState } from 'react';
import { Button } from '../ui/button';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { DataChartProps, DataPoint } from './CustomAreaChart';
import { ScrollView } from '../ui/scroll-view';

export interface CustomChartButtonsProps {
  buttons: string[];
  data: DataChartProps[];
  onDataChartPointsChange: (points: DataPoint[]) => void;
  onDataChartTotalChange: (total: string) => void;
}

const CustomChartButtons: React.FC<CustomChartButtonsProps> = ({
  buttons,
  data,
  onDataChartPointsChange,
  onDataChartTotalChange,
}) => {
  const [activeButton, setActiveButton] = useState(buttons[0]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack className="justify-between gap-4">
        {buttons.map((button, index) => (
          <Button
            key={index}
            className={
              activeButton === button
                ? 'rounded-lg bg-blue-500'
                : 'rounded-lg bg-background-50'
            }
            onPress={() => {
              setActiveButton(button);
              onDataChartPointsChange(data[index].dataPoints);
              onDataChartTotalChange(data[index].dataTotal);
            }}
          >
            <Text className="text-white">{buttons[index]}</Text>
          </Button>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default CustomChartButtons;