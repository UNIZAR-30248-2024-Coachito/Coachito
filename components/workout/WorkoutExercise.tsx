import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import '../../styles.css';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';

export interface WorkoutExercise {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  series: number;
}

export interface WorkoutExercises {
  header: WorkoutHeaderResume;
  exercises: WorkoutExercise[];
}

export interface WorkoutHeaderResume {
  workoutName: string;
  workoutDate: Date;
  workoutTime: number;
  workoutVolume: number;
  workoutSeries: number;
}

const WorkoutExercisesComponent: React.FC<WorkoutExercises> = ({
  header,
  exercises,
}) => {
  return (
    <Box>
      <Text className="font-semibold mb-2 text-white">
        {header.workoutName}
      </Text>
      <ScrollView>
        <VStack className="gap-y-4">
          {exercises.map((exercise, index) => (
            <Box key={index}>
              <HStack className="items-center gap-4">
                <Avatar>
                  <AvatarFallbackText>
                    {exercise.exerciseName}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: exercise.exerciseThumbnailUrl,
                    }}
                  />
                </Avatar>
                <Text className="flex-1 text-white">
                  {exercise.exerciseName}
                </Text>
              </HStack>
              <VStack className="mt-2">
                {/* Simulamos información de cada serie */}
                {Array.from({ length: exercise.series }).map(
                  (_, seriesIndex) => (
                    <Text key={seriesIndex} className="text-gray-400">
                      Serie {seriesIndex + 1}: 10 repeticiones a 50 kg
                    </Text>
                  )
                )}
              </VStack>
            </Box>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default WorkoutExercisesComponent;
