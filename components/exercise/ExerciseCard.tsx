import React from 'react';
import '../../styles.css';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Box } from '../ui/box';
import { Button } from '../ui/button';

export interface ExerciseCard {
  exercise: Exercise;
}

export interface Exercise {
  exerciseName: string;
  exerciseThumbnailUrl: string;
}

const ExerciseCard: React.FC<ExerciseCard> = ({ exercise }) => {
  return (
    <Box className="">
      {/* VStack para apilar verticalmente los elementos */}
      <VStack className="w-full space-y-4">
        {/* Fila con la imagen y el nombre del ejercicio */}
        <HStack className="w-full items-center gap-4">
          <Avatar>
            <AvatarFallbackText>{exercise.exerciseName}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: exercise.exerciseThumbnailUrl,
              }}
            />
          </Avatar>
          <Text className="text-white">{exercise.exerciseName}</Text>
        </HStack>
        {/* Fila con el temporizador */}
        <Text className="text-white">Temporizador</Text>
        {/* Fila con el botón centrado */}
        <HStack className="justify-center">
          <Button className="bg-blue-500 px-4 py-2">
            <Text className="text-white">Agregar Serie</Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ExerciseCard;
