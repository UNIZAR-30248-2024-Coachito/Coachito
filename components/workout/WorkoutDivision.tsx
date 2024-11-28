import React from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { VStack } from '../ui/vstack';
import { HStack } from '../ui/hstack';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';

export interface ExerciseProportion {
  name: string;
  proportion: number;
}

export interface WorkoutDivision {
  exercisesProportion: ExerciseProportion[];
  textColor: string;
}

const WorkoutDivisionComponent: React.FC<WorkoutDivision> = ({
  exercisesProportion,
  textColor,
}) => {
  return (
    <VStack className="justify-between gap-x-8 mb-4">
      {exercisesProportion.map((exerciseProportion, index) => (
        <Box key={index}>
          <Text style={{ color: textColor }} className="text-l mb-1">
            {exerciseProportion.name}
          </Text>
          <HStack>
            <Progress
              className="h-[30px] bg-transparent"
              value={100}
              size="md"
              orientation="horizontal"
              style={{
                width: `${exerciseProportion.proportion * 0.9}%`,
              }}
            >
              <ProgressFilledTrack
                testID="progress-bar"
                className="bg-blue-500 rounded-lg"
              />
            </Progress>
            <Text className="text-l text-gray-400 ml-2">
              {exerciseProportion.proportion.toFixed(0)}%
            </Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default WorkoutDivisionComponent;
