import React, { useEffect, useState } from 'react';
import '../styles.css';
import { Text } from '../components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { RootStackParamList } from '@/types/navigation';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useFetchExerciseDetails } from '@/hooks/exerciseHook';
import { HStack } from '@/components/ui/hstack';
import { Award, Table } from 'lucide-react-native';
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableData,
} from '@/components/ui/table';
import AreaChart, {
  DataChartProps,
  DataPoint,
} from '@/components/shared/AreaChart';
import { Button } from '@/components/ui/button';

export interface SerieRecords {
  reps: number;
  personalBest: number;
}

export interface ExerciseDetails {
  id: number;
  name: string;
  imageUrl: string;
  primaryMuscleGroup: string;
  higherWeight: number;
  best1rm: number;
  bestSerieVolume: string;
  bestTotalVolume: number;
  serieRecords: SerieRecords[];
  dataPoints: DataChartProps[];
}

const DetailsExercise: React.FC<ExerciseDetails> = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DetailsExercise'>>();
  const { exerciseId } = route.params;
  const [exercisesDetails, setExercisesDetails] = useState<ExerciseDetails>();
  const [activeButton, setActiveButton] = useState('peso');
  const [dataChartPoints, setDataChartPoints] = useState<DataPoint[]>([]);
  const [dataChartTotal, setDataChartTotal] = useState<string>('');

  const fetchExercisesDetails = async () => {
    const { exerciseDetails, error: errorRoutines } =
      await useFetchExerciseDetails(exerciseId);

    if (!errorRoutines) {
      setExercisesDetails(exerciseDetails!);
      setDataChartPoints(exerciseDetails!.dataPoints[0].dataPoints);
      setDataChartTotal(exerciseDetails!.dataPoints[0].dataTotal);
    }
  };

  useEffect(() => {
    fetchExercisesDetails();
  }, [exerciseId]);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        {/* Imagen ejercicio */}

        <Text size="2xl" bold>
          {exercisesDetails?.name}
        </Text>

        <Text className="text-gray-400 mb-4">
          Primario: {exercisesDetails?.primaryMuscleGroup}
        </Text>

        <AreaChart dataPoints={dataChartPoints} dataTotal={dataChartTotal} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <HStack className="gap-4">
            <Button
              className={
                activeButton === 'peso'
                  ? 'rounded-lg bg-blue-500'
                  : 'rounded-lg bg-background-50'
              }
              onPress={() => {
                setActiveButton('peso');
                setDataChartPoints(exercisesDetails!.dataPoints[0].dataPoints);
                setDataChartTotal(exercisesDetails!.dataPoints[0].dataTotal);
              }}
            >
              <Text className="text-white">Mayor Peso</Text>
            </Button>
            <Button
              className={
                activeButton === '1rm'
                  ? 'rounded-lg bg-blue-500'
                  : 'rounded-lg bg-background-50'
              }
              onPress={() => {
                setActiveButton('1rm');
                setDataChartPoints(exercisesDetails!.dataPoints[1].dataPoints);
                setDataChartTotal(exercisesDetails!.dataPoints[1].dataTotal);
              }}
            >
              <Text className="text-white">One Rep Max</Text>
            </Button>
            <Button
              className={
                activeButton === 'volumen'
                  ? 'rounded-lg bg-blue-500'
                  : 'rounded-lg bg-background-50'
              }
              onPress={() => {
                setActiveButton('volumen');
                setDataChartPoints(exercisesDetails!.dataPoints[2].dataPoints);
                setDataChartTotal(exercisesDetails!.dataPoints[2].dataTotal);
              }}
            >
              <Text className="text-white">Mejor Volumen</Text>
            </Button>
          </HStack>
        </ScrollView>

        <VStack className="gap-4 mb-4">
          <HStack className="gap-2">
            <Award color="yellow" />
            <Text className="text-gray-400">Records Personales</Text>
          </HStack>

          <HStack className="justify-between">
            <Text>Mayor Peso</Text>
            <Text className="text-blue-500">
              {exercisesDetails?.higherWeight} kg
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text>Mejor 1RM</Text>
            <Text className="text-blue-500">
              {exercisesDetails?.best1rm} kg
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text>Mejor volumen (serie)</Text>
            <Text className="text-blue-500">
              {exercisesDetails?.bestSerieVolume}
            </Text>
          </HStack>

          <HStack className="justify-between">
            <Text>Mejor volumen total</Text>
            <Text className="text-blue-500">
              {exercisesDetails?.bestTotalVolume} kg
            </Text>
          </HStack>
        </VStack>

        <Text className="text-gray-400 mt-4">Records de Serie</Text>

        <HStack className="gap-8 mb-2">
          <Text bold>Reps</Text>
          <Text bold>Mejor Marca Personal</Text>
        </HStack>
        <VStack className="gap-4">
          {exercisesDetails?.serieRecords.map((exercise, index) => (
            <HStack key={index} className="gap-8">
              <Text className="ml-2">{exercise.reps}</Text>
              <Text className="ml-4">{exercise.personalBest} kg</Text>
            </HStack>
          ))}
        </VStack>

        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Reps</TableHead>
              <TableHead>Mejor Marca Personal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercisesDetails?.serieRecords.map((exercise, index) => (
              <TableRow key={index}>
                <TableData>{exercise.reps}</TableData>
                <TableData>{exercise.personalBest} kg</TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </VStack>
    </ScrollView>
  );
};

export default DetailsExercise;
