import React from 'react';
import '../../styles.css';
import { Pressable } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';

export interface ExerciseCardResume {
  exerciseResume: ExerciseResume;
  onSelect: () => void; // Agregamos onSelect como función que no recibe argumentos y no devuelve nada
  isSelected: boolean;
}

export interface ExerciseResume {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  primaryMuscleGroup: string;
}

const ExerciseCardResumeComponent: React.FC<ExerciseCardResume> = ({
  exerciseResume,
  onSelect,
  isSelected,
}) => {
  return (
    <Pressable onPress={onSelect} className="mt-6">
      <HStack
        className={`items-center gap-4 rounded-lg ${isSelected ? 'bg-blue-500' : ' bg-zinc-900 '}`}
      >
        <Avatar>
          <AvatarFallbackText>{exerciseResume.exerciseName}</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: exerciseResume.exerciseThumbnailUrl,
            }}
          />
        </Avatar>
        <VStack>
          <Text className="flex-1 w-screen text-white">
            {exerciseResume.exerciseName}
          </Text>
          <Text className="flex-1 w-screen text-white">
            {exerciseResume.primaryMuscleGroup}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
};

export default ExerciseCardResumeComponent;
