import React from 'react';
import { Box } from 'lucide-react-native';
import ExerciseCard, { Exercise } from './ExerciseCard';
import { VStack } from '../ui/vstack';

const ExerciseListCard: React.FC = () => {
  const exercises: Exercise[] = [
    {
      exerciseName: 'Sentadilla',
      exerciseThumbnailUrl: 'https://link_a_la_imagen_sentadilla.jpg',
    },
    {
      exerciseName: 'Press de banca',
      exerciseThumbnailUrl: 'https://link_a_la_imagen_press_banca.jpg',
    },
    // Puedes añadir más ejercicios aquí
  ];

  return (
    <Box>
      <VStack>
        {exercises!.map((exercise, index) => {
          return <ExerciseCard key={index} exercise={exercise} />;
        })}
      </VStack>
    </Box>
  );
};

export default ExerciseListCard;
