import React from 'react';
import { Text } from '../ui/text';
import { HStack } from '../ui/hstack';
import { Box } from '../ui/box';
import { VStack } from '../ui/vstack';
import { Button } from '../ui/button';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { InputField, Input } from '../ui/input';
import { ScrollView } from 'react-native';
import { useFetchAddExercise } from '@/hooks/addExerciseHook';
import ExerciseCardResumeComponent from './ExerciseCardResume';

const AddExercise: React.FC = () => {
  const { exerciseResumes, loading, error } = useFetchAddExercise();
  const navigation = useNavigation<NavigationProps>();

  return (
    <Box className="flex-1 p-4">
      {/* Contenedor principal */}
      <VStack className="space-y-4">
        {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
        <HStack className="justify-between items-center">
          <Button
            className="bg-black"
            onPress={() => navigation.navigate('Routine')}
          >
            <Text className="text-blue-500 ">Cancelar</Text>
          </Button>
          <Text className="text-xl">Agregar Ejercicio</Text>
          <Button
            className="bg-blue-500"
            onPress={() => navigation.navigate('Routine')}
          >
            <Text className="text-white ">Guardar</Text>
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
        {/*
        <VStack className="space-y-2 p-4">
          {ejercicios.map((ejercicio, index) => (
            <Pressable
              key={index}
              className="items-left p-4"
              onPress={() => handlePress(index)}
              style={getStyle(index)}
            >
              <Text className="text-lg">{ejercicio.name}</Text>
              <Text>{ejercicio.foto}</Text>
            </Pressable>
          ))}
        </VStack>*/}
        <ScrollView>
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
        </ScrollView>
      </VStack>
    </Box>
  );
};

export default AddExercise;
