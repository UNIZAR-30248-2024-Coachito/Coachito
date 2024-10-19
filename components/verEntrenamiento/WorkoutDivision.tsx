import React from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import '../../styles.css';

export interface WorkoutDivision {
  pecho: number;
  espalda: number;
  pierna: number;
}

const WorkoutDivisionComponent: React.FC<WorkoutDivision> = ({
  pecho,
  espalda,
  pierna,
}) => {
  // Calcular el total de ejercicios
  const totalEjercicios = pecho + espalda + pierna;

  // Calcular el porcentaje de cada grupo de ejercicios
  const pechoPorcentaje =
    totalEjercicios > 0 ? (pecho / totalEjercicios) * 100 : 0;
  const espaldaPorcentaje =
    totalEjercicios > 0 ? (espalda / totalEjercicios) * 100 : 0;
  const piernaPorcentaje =
    totalEjercicios > 0 ? (pierna / totalEjercicios) * 100 : 0;

  return (
    <Box>
      <VStack className="justify-between gap-x-8 mb-4">
        <VStack className="flex-1 mb-2">
          <Text className="text-l mb-2 text-white">Pecho</Text>
          <HStack>
            <Progress
              value={100}
              size="md"
              orientation="horizontal"
              style={{
                width: `${pechoPorcentaje * 0.9}%`,
                height: 30,
              }}
            >
              <ProgressFilledTrack
                style={{ borderRadius: 5, backgroundColor: '#4CAF50' }}
              />
            </Progress>
            <Text className="text-l text-gray-400 ml-2">
              {pechoPorcentaje}%
            </Text>
          </HStack>
        </VStack>

        <VStack className="flex-1 mb-2">
          <Text className="text-l mb-2 text-white">Espalda</Text>
          <HStack>
            <Progress
              value={100}
              size="md"
              orientation="horizontal"
              style={{
                width: `${espaldaPorcentaje * 0.9}%`,
                height: 30,
                backgroundColor: 'transparent',
              }}
            >
              <ProgressFilledTrack
                style={{ borderRadius: 5, backgroundColor: '#4CAF50' }}
              />
            </Progress>
            <Text className="text-l text-gray-400 ml-2">
              {espaldaPorcentaje}%
            </Text>
          </HStack>
        </VStack>

        <VStack>
          <Text className="text-l mb-2 text-white">Pierna</Text>
          <HStack>
            <Progress
              value={100}
              size="md"
              orientation="horizontal"
              style={{
                width: `${piernaPorcentaje * 0.9}%`,
                height: 30,
                backgroundColor: 'transparent',
              }}
            >
              <ProgressFilledTrack
                style={{ borderRadius: 5, backgroundColor: '#4CAF50' }}
              />
            </Progress>
            <Text className="text-l text-gray-400 ml-2">
              {piernaPorcentaje}%
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default WorkoutDivisionComponent;
