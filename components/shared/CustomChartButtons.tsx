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
  buttonColor: string;
  textColor: string;
}

const CustomChartButtons: React.FC<CustomChartButtonsProps> = ({
  buttons,
  data,
  onDataChartPointsChange,
  onDataChartTotalChange,
  buttonColor,
  textColor,
}) => {
  const [activeButton, setActiveButton] = useState(buttons[0]);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack className="justify-between gap-4">
        {buttons.map((button, index) => (
          <Button
            key={index}
            style={[
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  activeButton === button ? '#3B82F6' : buttonColor,
              },
              // eslint-disable-next-line react-native/no-inline-styles
              { borderRadius: 10 },
            ]}
            onPress={() => {
              setActiveButton(button);
              onDataChartPointsChange(data[index].dataPoints);
              onDataChartTotalChange(data[index].dataTotal);
            }}
          >
            <Text
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ color: activeButton === button ? '#ffffff' : textColor }}
            >
              {buttons[index]}
            </Text>
          </Button>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default CustomChartButtons;
