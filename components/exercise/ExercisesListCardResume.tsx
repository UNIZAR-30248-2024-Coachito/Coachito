import React from 'react';
import { VStack } from '../ui/vstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { ExerciseListResume } from '@/screens/AddExercise';

interface ExerciseResumeProps {
  exercises: ExerciseListResume;
}

const ExercisesResume: React.FC<ExerciseResumeProps> = ({ exercises }) => {
  return (
    <HStack className="gap-4 p-2 w-full">
      <Avatar>
        <AvatarFallbackText>{exercises.exerciseName}</AvatarFallbackText>
        <AvatarImage
          source={{
            uri: exercises.exerciseThumbnailUrl,
          }}
        />
      </Avatar>
      <VStack>
        <Text className="text-white">{exercises.exerciseName}</Text>
        <Text className="text-gray-400">{exercises.primaryMuscleGroup}</Text>
      </VStack>
    </HStack>
  );
};

export default ExercisesResume;
