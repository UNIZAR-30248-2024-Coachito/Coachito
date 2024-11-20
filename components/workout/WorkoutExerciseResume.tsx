import {
  Box,
  Text,
  VStack,
  HStack,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@gluestack-ui/themed';
import React from 'react';

export interface WorkoutExerciseResume {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  series: number;
}

export interface WorkoutExercisesResume {
  exercises: WorkoutExerciseResume[];
}

const WorkoutExercisesResumeComponent: React.FC<WorkoutExercisesResume> = ({
  exercises,
}) => {
  const totalVisibleExercises = 3;
  const visibleExercises = exercises.slice(0, totalVisibleExercises);

  return (
    <Box>
      <Text className="font-semibold mb-2 text-white">Entrenamiento</Text>
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
      {exercises.length > totalVisibleExercises && (
        <Text className="mt-2 text-gray-400 text-center">
          Ver {exercises.length - totalVisibleExercises} ejercicios más
        </Text>
      )}
    </Box>
  );
};

export default WorkoutExercisesResumeComponent;
