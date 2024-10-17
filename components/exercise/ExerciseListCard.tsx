import React from 'react';
import ExerciseCard, { Exercise } from './ExerciseCard';
import { VStack } from '../ui/vstack';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Plus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';

const ExerciseListCard: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const exercises: Exercise[] = [
    {
      exerciseName: 'Remo Sentado (Máquina)',
      exerciseThumbnailUrl: 'https://link_a_la_imagen_sentadilla.jpg',
    },
    {
      exerciseName: 'Press de Hombros Sentado (Máquina)',
      exerciseThumbnailUrl: 'https://link_a_la_imagen_press_banca.jpg',
    },
    // Puedes añadir más ejercicios aquí
  ];

  return (
    <VStack className="">
      {exercises!.map((exercise, index) => {
        return <ExerciseCard key={index} exercise={exercise} />;
      })}
      <Button
        className="bg-blue-500 w-full mt-4 rounded-lg"
        onPress={() => navigation.navigate('AddExercise')}
      >
        <Plus color={'white'} />
        <Text className="text-white">Agregar Ejercicio</Text>
      </Button>
    </VStack>
  );
};

export default ExerciseListCard;
