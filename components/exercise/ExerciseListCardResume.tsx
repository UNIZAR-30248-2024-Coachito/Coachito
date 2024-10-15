import React from 'react';
import { useFetchAddExercise } from '@/hooks/addExerciseHook';
import { Box } from 'lucide-react-native';
import { VStack } from '../ui/vstack';
import ExerciseCardResumeComponent from './ExerciseCardResume';

const ExerciseListCardResume: React.FC = () => {
  const { exerciseResumes, loading, error } = useFetchAddExercise();

  return (
    <Box className="flex-1 p-4">
      {/* Contenedor principal */}
      <VStack className="space-y-4">
        {/* Mostrar lista de ejercicios */}
        <VStack className="p-4">
          {!loading &&
            !error &&
            exerciseResumes!.map((exercise, index) => (
              <ExerciseCardResumeComponent
                key={index}
                exerciseResume={exercise.exerciseResume}
              />
            ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default ExerciseListCardResume;
