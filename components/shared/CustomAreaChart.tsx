/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import '../../styles.css';
import { LineChart } from 'react-native-gifted-charts';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Dimensions } from 'react-native';
import CustomChartButtons from './CustomChartButtons';
import { VStack } from '../ui/vstack';

export interface DataPoint {
  value: number;
  label: string;
}

export interface DataChartProps {
  dataPoints: DataPoint[];
  dataTotal: string;
}

export interface CustomDataChartProps {
  data: DataChartProps[];
  buttons: string[];
}

const CustomAreaChart: React.FC<CustomDataChartProps> = ({ data, buttons }) => {
  const screenWidth = Dimensions.get('window').width;
  const [dataChartPoints, setDataChartPoints] = useState<DataPoint[]>([]);
  const [dataChartTotal, setDataChartTotal] = useState<string>('');

  useEffect(() => {
    if (data && data.length > 0) {
      setDataChartPoints(data[0].dataPoints);
      setDataChartTotal(data[0].dataTotal);
    }
  }, [data]);

  return (
    <VStack className="gap-4">
      <HStack className="justify-between">
        <Text bold>{dataChartTotal}</Text>
        <Text>Últimos 3 meses</Text>
      </HStack>
      <LineChart
        areaChart
        data={dataChartPoints}
        dataPointsColor="#3b82f6"
        startFillColor="#3b82f6"
        startOpacity={0.8}
        endFillColor="#3b82f6"
        endOpacity={0.2}
        xAxisColor="gray"
        xAxisThickness={1}
        xAxisLabelTextStyle={{ color: 'gray' }}
        yAxisColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        yAxisThickness={1}
        rulesColor="rgba(255, 255, 255, 0.2)"
        rulesType="solid"
        spacing={60}
        width={screenWidth - 90}
        isAnimated
        animateOnDataChange
      />

      <CustomChartButtons
        buttons={buttons}
        data={data}
        onDataChartPointsChange={setDataChartPoints}
        onDataChartTotalChange={setDataChartTotal}
      />
    </VStack>
  );
};

export default CustomAreaChart;
