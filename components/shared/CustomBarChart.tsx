import React, { useState } from 'react';
import '../../styles.css';
import { BarChart } from 'react-native-gifted-charts';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Dimensions } from 'react-native';
import { VStack } from '../ui/vstack';
import CustomChartButtons from './CustomChartButtons';

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

const CustomBarChart: React.FC<CustomDataChartProps> = ({ data, buttons }) => {
  const [dataChartPoints, setDataChartPoints] = useState<DataPoint[]>([]);
  const [dataChartTotal, setDataChartTotal] = useState<string>('0');
  const screenWidth = Dimensions.get('window').width;

  return (
    <VStack className="gap-4">
      <HStack className="justify-between">
        <Text bold>{dataChartTotal}</Text>
        <Text>Últimos 3 meses</Text>
      </HStack>

      <BarChart
        barWidth={22}
        noOfSections={3}
        barBorderRadius={4}
        frontColor="#3b82f6"
        data={dataChartPoints}
        yAxisThickness={1}
        yAxisColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        xAxisThickness={1}
        xAxisColor="gray"
        xAxisLabelTextStyle={{ color: 'gray' }}
        rulesType="solid"
        rulesColor="rgba(255, 255, 255, 0.2)"
        spacing={30}
        width={screenWidth - 60}
      />

      <CustomChartButtons
        names={buttons}
        data={data}
        onDataChartPointsChange={setDataChartPoints}
        onDataChartTotalChange={setDataChartTotal}
      />
    </VStack>
  );
};

export default CustomBarChart;
