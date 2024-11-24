import React from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { calculateDaysDifferenceNow } from '@/utils/date';
import { convertIntervalToMinutes } from '@/utils/interval';

export interface WorkoutHeaderResume {
  textColor: string;
  workoutId: number;
  workoutName: string;
  workoutDate: string;
  workoutTime: string;
  workoutVolume: number;
  workoutSeries: number;
}

const WorkoutHeaderResumeComponent: React.FC<WorkoutHeaderResume> = ({
  textColor,
  workoutName,
  workoutDate,
  workoutTime,
  workoutVolume,
  workoutSeries,
}) => {
  const daysOffset = calculateDaysDifferenceNow(workoutDate);
  const timeInMin = convertIntervalToMinutes(workoutTime);

  return (
    <Box>
      <HStack className="items-center mb-2 space-x-2">
        <VStack>
          <Text style={{ color: textColor }} className="text-xl font-bold mb-2">
            {workoutName}
          </Text>
          <Text style={{ color: textColor }} className="text-xs">
            hace {daysOffset} {daysOffset > 1 ? 'días' : 'día'}
          </Text>
        </VStack>
      </HStack>
      <HStack className="justify-between gap-x-8 mb-4">
        <VStack>
          <Text style={{ color: textColor }} className="text-gray-400">
            Tiempo
          </Text>
          <Text style={{ color: textColor }} className="text-white">
            {timeInMin} min
          </Text>
        </VStack>
        <VStack>
          <Text style={{ color: textColor }}>Volumen</Text>
          <Text style={{ color: textColor }}>{workoutVolume} Kg</Text>
        </VStack>
        <VStack>
          <Text style={{ color: textColor }}>Series</Text>
          <Text style={{ color: textColor }}>{workoutSeries}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default WorkoutHeaderResumeComponent;
