import React from 'react';
import { ExerciseResume } from '../routine/ExercisesRoutineResume';
import { Avatar, AvatarFallbackText, HStack, AvatarImage, Text, VStack } from '@gluestack-ui/themed';

const ExercisesListCardResume: React.FC<ExerciseResume> = ({
  name,
  thumbnailUrl,
  primaryMuscleGroup,
}) => {
  return (
    <HStack className="gap-4 p-2 w-full">
      <Avatar>
        <AvatarFallbackText>{name}</AvatarFallbackText>
        <AvatarImage
          source={{
            uri: thumbnailUrl,
          }}
        />
      </Avatar>
      <VStack>
        <Text className="text-white">{name}</Text>
        <Text className="text-gray-400">{primaryMuscleGroup}</Text>
      </VStack>
    </HStack>
  );
};

export default ExercisesListCardResume;
