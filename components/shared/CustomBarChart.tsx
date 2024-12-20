/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { BarChart } from 'react-native-gifted-charts';
import { HStack } from '../ui/hstack';
import { Text } from '../ui/text';
import { Dimensions } from 'react-native';
import { VStack } from '../ui/vstack';
import CustomChartButtons from './CustomChartButtons';
import { CustomDataChartProps, DataPoint } from './CustomAreaChart';

const CustomBarChart: React.FC<CustomDataChartProps> = ({ data, buttons }) => {
  const [dataChartPoints, setDataChartPoints] = useState<DataPoint[]>([]);
  const [dataChartTotal, setDataChartTotal] = useState<string>('0');
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    if (data && data.length > 0) {
      setDataChartPoints(data[0].dataPoints);
      setDataChartTotal(data[0].dataTotal);
    }
  }, [data]);

  return (
    <VStack testID="bar-chart" className="gap-4">
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
        width={screenWidth - 90}
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

export default CustomBarChart;
