import React, { useState } from 'react';
import { Text } from '../components/ui/text';
import { HStack } from '../components/ui/hstack';
import { Box } from '../components/ui/box';
import { VStack } from '../components/ui/vstack';
import { Button } from '../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { InputField, Input } from '../components/ui/input';
import ExerciseListCardResume from '@/components/exercise/ExerciseListCardResume';

const AddExercise: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleSelectExercise = (exerciseName: string) => {
    setSelectedExercises((prevSelected) => {
      if (prevSelected.includes(exerciseName)) {
        // Si el ejercicio ya está seleccionado, lo eliminamos
        return prevSelected.filter((name) => name !== exerciseName);
      } else {
        // Si no está seleccionado, lo añadimos
        return [...prevSelected, exerciseName];
      }
    });
  };

  const handleSaveExercises = () => {
    console.log('Ejercicios guardados:', selectedExercises);
    // Aquí puedes agregar la lógica para guardar los ejercicios
    setSelectedExercises([]);
  };

  return (
    <Box className="flex-1 p-4">
      {/* Contenedor principal */}
      <VStack className="flex-1 pace-y-4">
        {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
        <HStack className="justify-between items-center">
          <Button
            className="bg-black"
            onPress={() => navigation.navigate('Routine')}
          >
            <Text className="text-blue-500 ">Cancelar</Text>
          </Button>
          <Text className="text-xl pr-4">Agregar Ejercicio</Text>
          <Button className="bg-blue-500">
            <Text className="text-white ">Crear</Text>
          </Button>
        </HStack>
        {/* Input para filtrar un ejercicio*/}
        <Box className="w-full pt-2">
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField className="text-white" placeholder="Buscar Ejercicio" />
          </Input>
        </Box>
        {/* Mostrar lista de ejercicios */}
        <ExerciseListCardResume
          selectedExercises={selectedExercises}
          onSelect={handleSelectExercise}
        />
        <HStack className="justify-center mt-auto">
          {selectedExercises.length > 0 && (
            <HStack className="justify-center">
              <Button
                className="bg-blue-500 flex-grow"
                onPress={() => {
                  handleSaveExercises();
                  navigation.navigate('SaveRoutine');
                }}
              >
                <Text className="text-white">Añadir Ejercicios</Text>
              </Button>
            </HStack>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default AddExercise;
