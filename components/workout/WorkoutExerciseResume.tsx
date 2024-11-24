import React from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';

export interface WorkoutExerciseResume {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  series: number;
}

export interface WorkoutExercisesResume {
  textColor: string;
  exercises: WorkoutExerciseResume[];
}

const WorkoutExercisesResumeComponent: React.FC<WorkoutExercisesResume> = ({
  textColor,
  exercises,
}) => {
  const totalVisibleExercises = 3;
  const visibleExercises = exercises.slice(0, totalVisibleExercises);

  return (
    <Box>
      <Text style={{ color: textColor }} className="font-semibold mb-2">
        Entrenamiento
      </Text>
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
            <Text style={{ color: textColor }} className="flex-1">
              {exercise.series} series {exercise.exerciseName}
            </Text>
          </HStack>
        ))}
      </VStack>
      {exercises.length > totalVisibleExercises && (
        <Text style={{ color: textColor }} className="mt-2 text-center">
          Ver {exercises.length - totalVisibleExercises} ejercicios más
        </Text>
      )}
    </Box>
  );
};

export default WorkoutExercisesResumeComponent;
