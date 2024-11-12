import React, { useEffect, useState } from 'react';
import '../styles.css';
import { Text } from '../components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { RootStackParamList } from '@/types/navigation';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useFetchExerciseDetails } from '@/hooks/exerciseHook';
import { HStack } from '@/components/ui/hstack';
import { Award } from 'lucide-react-native';
import CustomAreaChart, {
  DataChartProps,
} from '@/components/shared/CustomAreaChart';
import { Image } from 'react-native';

export interface repsWeight {
  reps: number;
  weight: number;
}

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
  bestSerieVolume: repsWeight;
  bestTotalVolume: number;
  serieRecords: SerieRecords[];
  dataPoints: DataChartProps[];
}

const DetailsExercise: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DetailsExercise'>>();
  const { exerciseId } = route.params;
  const [exercisesDetails, setExercisesDetails] = useState<ExerciseDetails>();
  const buttons = ['Mayor Peso', 'One Rep Max', 'Mejor Volumen'];

  const fetchExercisesDetails = async () => {
    const { data, error } = await useFetchExerciseDetails(exerciseId);

    if (!error) {
      setExercisesDetails(data);
    } else {
      alert(
        'Se ha producido un error al obtener la información del ejercicio.'
      );
    }
  };

  useEffect(() => {
    fetchExercisesDetails();
  }, [exerciseId]);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        <Image
          // eslint-disable-next-line react-native/no-inline-styles
          style={{ height: 300 }}
          source={{ uri: exercisesDetails?.imageUrl }}
          className="mb-4 w-100"
          resizeMode="cover"
        />

        <Text size="2xl" bold>
          {exercisesDetails?.name}
        </Text>

        <Text className="text-gray-400 mb-4">
          Primario: {exercisesDetails?.primaryMuscleGroup}
        </Text>

        {exercisesDetails && (
          <CustomAreaChart
            data={exercisesDetails?.dataPoints}
            buttons={buttons}
          />
        )}

        <VStack className="gap-4 mt-4 mb-4">
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
              {exercisesDetails?.bestSerieVolume.reps} x{' '}
              {exercisesDetails?.bestSerieVolume.weight} kg
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
      </VStack>
    </ScrollView>
  );
};

export default DetailsExercise;
