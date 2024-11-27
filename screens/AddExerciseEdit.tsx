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
import { Alert, Pressable, ScrollView } from 'react-native';
import { useFetchExercisesList } from '@/hooks/exerciseHook';
import ExercisesListCardResume from '@/components/exercise/ExercisesListCardResume';
import { SearchIcon } from 'lucide-react-native';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import { emitter } from '@/utils/emitter';

type AddExerciseEditRouteProp = RouteProp<
  RootStackParamList,
  'AddExerciseEdit'
>;

interface AddExerciseEditProps {
  backgroundColor: string;
  textColor: string;
}

const AddExerciseEdit: React.FC<AddExerciseEditProps> = ({
  backgroundColor,
  textColor,
}) => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<AddExerciseEditRouteProp>();

  const [exercises, setExercises] = useState<ExerciseResume[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseResume[]>(
    route.params!.selectedExercises || []
  );

  const handleSelectExercise = (exercise: ExerciseResume) => {
    setSelectedExercises((prevSelected) => {
      const exists = prevSelected.find((e) => e.id === exercise.id);
      if (exists) {
        return prevSelected.filter((e) => e.id !== exercise.id);
      } else {
        if (prevSelected.length >= 20) {
          Alert.alert('', 'Solo se pueden seleccionar hasta 20 ejercicios.', [
            { text: 'OK' },
          ]);
          return prevSelected;
        }
        return [...prevSelected, exercise];
      }
    });
  };

  const fetchExercises = async () => {
    const { data, error: errorExercises } = await useFetchExercisesList();
    if (!errorExercises) {
      setExercises(data);
    } else {
      Alert.alert('', 'Se ha producido un error obteniendo los ejercicios.', [
        { text: 'OK' },
      ]);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    setSelectedExercises(route.params!.selectedExercises || []);
  }, [route.params!.selectedExercises]);
  //console.log(backgroundColor);
  //console.log(textColor);
  return (
    <ScrollView className="flex-1">
      <VStack
        style={{ backgroundColor: backgroundColor }}
        className="p-4 gap-4"
      >
        <HStack className="items-left gap-4">
          <Button
            className="bg-transparent rounded-lg"
            onPress={() => {
              navigation.navigate('EditRoutine', {
                routineId: route.params.routineId,
                routineName: route.params.routineName,
              });
            }}
          >
            <Text className="text-blue-500">Cancelar</Text>
          </Button>
          <Text style={{ color: textColor }} className="text-xl">
            Agregar Ejercicio
          </Text>
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
          <InputField
            style={{ color: textColor }}
            placeholder="Buscar Ejercicio"
          />
        </Input>

        {exercises.map((exercise, index) => (
          <Pressable key={index} onPress={() => handleSelectExercise(exercise)}>
            <HStack
              className={`${selectedExercises.some((e) => e.id === exercise.id) ? 'bg-blue-500' : 'bg-transparent'}`}
            >
              <ExercisesListCardResume
                backgroundColor={backgroundColor}
                textColor={textColor}
                id={exercise.id}
                name={exercise.name}
                thumbnailUrl={exercise.thumbnailUrl}
                notes={exercise.notes}
                primaryMuscleGroup={exercise.primaryMuscleGroup}
                restTime={exercise.restTime}
                sets={exercise.sets}
              />
            </HStack>
          </Pressable>
        ))}

        {selectedExercises.length > 0 && (
          <Button
            className="w-full bg-blue-500 rounded-lg"
            onPress={() => {
              emitter.emit('exercisesUpdated', selectedExercises);
              navigation.navigate('EditRoutine', {
                routineId: route.params.routineId,
                routineName: route.params.routineName,
              });
            }}
          >
            <Text style={{ color: textColor }}>Añadir Ejercicios</Text>
          </Button>
        )}
      </VStack>
    </ScrollView>
  );
};

export default AddExerciseEdit;
