import React from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import '../../styles.css';

export interface WorkoutHeader {
  workoutName: string;
  workoutTime: number;
  workoutVolume: number;
  workoutSeries: number;
}

const WorkoutHeaderComponent: React.FC<WorkoutHeader> = ({
  workoutName,
  workoutTime,
  workoutVolume,
  workoutSeries,
}) => {
  return (
    <Box>
      <HStack className="items-center mb-2 space-x-2">
        <VStack>
          <Text className="text-xl font-bold mb-2 text-white">
            {workoutName}
          </Text>
        </VStack>
      </HStack>
      <HStack className="justify-between gap-x-8 mb-4">
        <VStack>
          <Text className="text-gray-400">Tiempo</Text>
          <Text className="text-white">{workoutTime} min</Text>
        </VStack>
        <VStack>
          <Text className="text-gray-400">Volumen</Text>
          <Text className="text-white">{workoutVolume} Kg</Text>
        </VStack>
        <VStack>
          <Text className="text-gray-400">Series</Text>
          <Text className="text-white">{workoutSeries}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default WorkoutHeaderComponent;
