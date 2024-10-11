import React from 'react';
import { Text } from '../components/ui/text';
import { Box } from '../components/ui/box';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import '../styles.css';
import { AvatarImage } from '../components/ui/avatar';
import { AvatarFallbackText } from '../components/ui/avatar';
import { Avatar } from '../components/ui/avatar';

export interface WorkoutExerciseResume {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  series: number;
}

export interface WorkoutExercisesResume {
  exercises: WorkoutExerciseResume[];
}

const ExerciseResume: React.FC<WorkoutExercisesResume> = ({ exercises }) => {
  const totalVisibleExercises = 3;
  const visibleExercises = exercises.slice(0, totalVisibleExercises);

  return (
    <Box>
      <VStack className="gap-y-4">
        {visibleExercises.map((exercise, index) => (
          <HStack key={index} className="items-center gap-4">
            <Avatar>
              <AvatarFallbackText>{exercise.exerciseName}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: exercise.exerciseThumbnailUrl,
                }}
              />
            </Avatar>
            <Text className="flex-1 text-white">
              {exercise.series} series {exercise.exerciseName}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default ExerciseResume;
