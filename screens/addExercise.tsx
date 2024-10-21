import React, { useEffect, useState } from 'react';
import { Text } from '../components/ui/text';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Button } from '../components/ui/button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps, RootStackParamList } from '@/types/navigation';
import {
  InputField,
  Input,
  InputSlot,
  InputIcon,
} from '../components/ui/input';
import { Pressable, ScrollView } from 'react-native';
import { useFetchExercisesList } from '@/hooks/addExerciseHook';
import ExercisesResume from '@/components/exercise/ExercisesListCardResume';
import { SearchIcon } from 'lucide-react-native';

export interface ExerciseListResume {
  id: number;
  exerciseName: string;
  exerciseThumbnailUrl: string;
  primaryMuscleGroup: string;
}

type AddExerciseRouteProp = RouteProp<RootStackParamList, 'AddExercise'>;

const AddExercise: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<AddExerciseRouteProp>();
  const [exercises, setExercises] = useState<ExerciseListResume[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseListResume[]
  >(route.params?.selectedExercises || []);

  const handleSelectExercise = (exercise: ExerciseListResume) => {
    setSelectedExercises((prevSelected) => {
      const exists = prevSelected.find(
        (e) => e.exerciseName === exercise.exerciseName
      );
      if (exists) {
        return prevSelected.filter(
          (e) => e.exerciseName !== exercise.exerciseName
        );
      } else {
        return [...prevSelected, exercise];
      }
    });
  };

  const fetchExercises = async () => {
    const { exercisesResume, error: errorExercises } =
      await useFetchExercisesList();

    if (!errorExercises) {
      setExercises(exercisesResume!);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4 gap-4">
        <HStack className="items-left gap-4">
          <Button
            className="bg-transparent rounded-lg"
            onPress={() => {
              navigation.navigate('AddRoutine', {
                exercises: selectedExercises,
              });
              setSelectedExercises([]);
            }}
          >
            <Text className="text-blue-500">Cancelar</Text>
          </Button>
          <Text className="text-xl">Agregar Ejercicio</Text>
        </HStack>

        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputSlot className="pl-3">
            <InputIcon as={SearchIcon} />
          </InputSlot>
          <InputField className="text-white" placeholder="Buscar Ejercicio" />
        </Input>

        {exercises.map((exercise, index) => {
          return (
            <Pressable
              key={index}
              onPress={() => {
                handleSelectExercise(exercise);
              }}
            >
              <HStack
                className={`${selectedExercises.includes(exercise) ? 'bg-blue-500' : 'bg-transparent'}`}
              >
                <ExercisesResume key="1" exercises={exercise} />
              </HStack>
            </Pressable>
          );
        })}

        {selectedExercises.length > 0 && (
          <Button
            className="w-full bg-blue-500 rounded-lg"
            onPress={() => {
              navigation.navigate('AddRoutine', {
                exercises: selectedExercises,
              });
            }}
          >
            <Text className="text-white">Añadir Ejercicios</Text>
          </Button>
        )}
      </VStack>
    </ScrollView>
  );
};

export default AddExercise;
