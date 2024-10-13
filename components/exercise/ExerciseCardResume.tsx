import React from 'react';
import '../../styles.css';
import { Pressable } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Box } from 'lucide-react-native';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';

export interface ExerciseCardResume {
  exerciseResume: ExerciseResume;
}

export interface ExerciseResume {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  primaryMuscleGroup: string;
}

const ExerciseCardResumeComponent: React.FC<ExerciseCardResume> = ({
  exerciseResume,
}) => {
  return (
    <Pressable className="bg-zinc-900 p-4 mb-4 rounded-lg">
      <Box>
        <HStack className="items-center gap-4">
          <Avatar>
            <AvatarFallbackText>
              {exerciseResume.exerciseName}
            </AvatarFallbackText>
            <AvatarImage
              source={{
                uri: exerciseResume.exerciseThumbnailUrl,
              }}
            />
          </Avatar>
          <VStack>
            <Text className="text-white">{exerciseResume.exerciseName}</Text>
            <Text className="text-white">
              {exerciseResume.primaryMuscleGroup}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
};

export default ExerciseCardResumeComponent;
