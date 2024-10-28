import React from 'react';
import '../../styles.css';
import { LineChart } from 'react-native-gifted-charts';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Dimensions } from 'react-native';

export interface DataPoint {
  value: number;
  label: string;
}

export interface DataChartProps {
  dataPoints: DataPoint[];
  dataTotal: string;
}

const RoutineChart: React.FC<DataChartProps> = ({ dataPoints, dataTotal }) => {
  const xAxisLabels = dataPoints.map((point) => point.label);
  const screenWidth = Dimensions.get('window').width;
  const spacing = screenWidth / Math.max(dataPoints.length, 1);

  return (
    <>
      <HStack className="justify-between mb-2">
        <Text bold>{dataTotal}</Text>
        <Text>Últimos 3 meses</Text>
      </HStack>
      <LineChart
        areaChart
        data={dataPoints}
        dataPointsColor="#3b82f6"
        startFillColor="#3b82f6"
        startOpacity={0.8}
        endFillColor="#3b82f6"
        endOpacity={0.2}
        xAxisColor="gray"
        xAxisThickness={1}
        xAxisLabelTexts={xAxisLabels}
        yAxisColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        yAxisThickness={1}
        rulesColor="rgba(255, 255, 255, 0.2)"
        rulesType="solid"
        spacing={spacing}
        width={screenWidth - 90}
      />
    </>
  );
};

export default RoutineChart;
