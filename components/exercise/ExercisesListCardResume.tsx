import React from 'react';
import { VStack } from '../ui/vstack';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { ExerciseResume } from '../routine/ExercisesRoutineResume';

const ExercisesListCardResume: React.FC<ExerciseResume> = ({
  name,
  thumbnailUrl,
  primaryMuscleGroup,
  backgroundColor,
  textColor,
}) => {
  return (
    <HStack
      style={{ backgroundColor: backgroundColor }}
      className="gap-4 p-2 w-full"
    >
      <Avatar>
        <AvatarFallbackText>{name}</AvatarFallbackText>
        <AvatarImage
          source={{
            uri: thumbnailUrl,
          }}
        />
      </Avatar>
      <VStack>
        <Text style={{ color: textColor }}>{name}</Text>
        <Text style={{ color: textColor }}>{primaryMuscleGroup}</Text>
      </VStack>
    </HStack>
  );
};

export default ExercisesListCardResume;
