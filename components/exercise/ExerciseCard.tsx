import React from 'react';
import '../../styles.css';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import { Box } from '../ui/box';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react-native';

export interface ExerciseCard {
  exercise: Exercise;
}

export interface Exercise {
  exerciseName: string;
  exerciseThumbnailUrl: string;
}

const ExerciseCard: React.FC<ExerciseCard> = ({ exercise }) => {
  return (
    <Box className="mt-2 rounded-lg">
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
          <Text className="text-blue-500">{exercise.exerciseName}</Text>
        </HStack>
        {/*Fila para los comentarios */}
        <HStack className="py-2">
          <Text className="text-gray-400">Agregar notas de rutinas aquí</Text>
        </HStack>
        {/* Fila con el temporizador */}
        <HStack className="justify-center py-2">
          <Text className="text-blue-500">Temporizador de descanso</Text>
        </HStack>
        {/*Fila para los datos */}
        <HStack className="my-4">
          <VStack>
            <Text className="text-gray-400">SERIE</Text>
            <Text className="text-white">1</Text>
          </VStack>
          <VStack>
            <Text className="text-gray-400 pl-4">KG</Text>
            <Text className="text-white pl-6">-</Text>
          </VStack>
          <VStack>
            <Text className="text-gray-400 pl-4">REPS</Text>
            <Text className="text-white pl-9">-</Text>
          </VStack>
        </HStack>
        {/* Fila con el botón centrado */}
        <HStack className="justify-center">
          <Button className="bg-zinc-900 w-full px-4 py-2 rounded-lg">
            <Plus color={'white'} />
            <Text className="text-white">Agregar Serie</Text>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ExerciseCard;
