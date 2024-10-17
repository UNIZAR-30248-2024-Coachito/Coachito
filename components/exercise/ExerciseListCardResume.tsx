import React from 'react';
import { useFetchAddExercise } from '@/hooks/addExerciseHook';
import { VStack } from '../ui/vstack';
import ExerciseCardResumeComponent from './ExerciseCardResume';

const ExerciseListCardResume: React.FC<{
  selectedExercises: string[]; // Recibe los ejercicios seleccionados
  onSelect: (exerciseName: string) => void; // Función para actualizar la selección
}> = ({ selectedExercises, onSelect }) => {
  const { exerciseResumes, loading, error } = useFetchAddExercise();

  return (
    <VStack className="space-y-4">
      {!loading &&
        !error &&
        exerciseResumes!.map((exercise, index) => {
          const exerciseName = exercise.exerciseResume.exerciseName;
          const isSelected = selectedExercises.includes(exerciseName); // Verifica si el ejercicio está seleccionado

          return (
            <ExerciseCardResumeComponent
              key={index}
              exerciseResume={exercise.exerciseResume}
              onSelect={() => onSelect(exerciseName)} // Llama a la función de selección
              isSelected={isSelected} // Marca si está seleccionado
            />
          );
        })}
    </VStack>
  );
};

export default ExerciseListCardResume;
