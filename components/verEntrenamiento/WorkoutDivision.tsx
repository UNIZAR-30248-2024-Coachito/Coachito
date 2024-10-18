import React from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { VStack } from '../ui/vstack';
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
  return (
    <Box>
      <VStack className="justify-between gap-x-8 mb-4">
        <VStack className="flex-1">
          <Text className="text-xl font-bold mb-2 text-white">Pecho</Text>
          <Progress
            value={pecho}
            size="md"
            orientation="horizontal"
            style={{
              width: '100%',
              height: 30,
              backgroundColor: 'transparent',
            }}
          >
            <ProgressFilledTrack
              style={{ borderRadius: 5, backgroundColor: '#4CAF50' }}
            />
          </Progress>
        </VStack>

        <VStack>
          <Text className="text-xl font-bold mb-2 text-white">Espalda</Text>
          <Progress
            value={espalda}
            size="md"
            orientation="horizontal"
            style={{
              width: '100%',
              height: 30,
              backgroundColor: 'transparent',
            }}
          >
            <ProgressFilledTrack
              style={{ borderRadius: 5, backgroundColor: '#4CAF50' }}
            />
          </Progress>
        </VStack>

        <VStack>
          <Text className="text-xl font-bold mb-2 text-white">Pierna</Text>
          <Progress
            value={pierna}
            size="md"
            orientation="horizontal"
            style={{
              width: '100%',
              height: 30,
              backgroundColor: 'transparent',
            }}
          >
            <ProgressFilledTrack
              style={{ borderRadius: 5, backgroundColor: '#4CAF50' }}
            />
          </Progress>
        </VStack>
      </VStack>
    </Box>
  );
};

export default WorkoutDivisionComponent;
