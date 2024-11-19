import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { InputField, Input } from '../components/ui/input';
import { Plus } from 'lucide-react-native';
import { Dumbbell } from 'lucide-react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps, RootStackParamList } from '@/types/navigation';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import {
  useCreateRoutine,
  useRoutineTitleExists,
} from '@/hooks/workoutTemplateHook';
import { Alert, ScrollView } from 'react-native';
import { emitter } from '@/utils/emitter';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import ExerciseResumeComponent, {
  ExerciseResumeRef,
} from '@/components/exercise/ExerciseResume';

const MAX_LENGHT_TITLE = 100;

const AddRoutine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddRoutine'>>();

  const [routineTitleInputValue, setRoutineTitleInputValue] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<ExerciseResume[]>(
    route.params.exercises
  );

  const [isCancelRoutineModalVisible, setIsCancelRoutineModalVisible] =
    useState(false);
  const exerciseRefs = useRef<(ExerciseResumeRef | null)[]>([]);

  const resetState = () => {
    setSelectedExercises([]);
    exerciseRefs.current = [];
    setRoutineTitleInputValue('');
  };

  const componentsCancelRoutinePopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere descartar la rutina?
    </Text>,
    <Button
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsCancelRoutineModalVisible(false);
        resetState();
        navigation.navigate('Routine');
      }}
    >
      <Text className="text-white">Descartar rutina</Text>
    </Button>,
    <Button
      testID="cancel-cancel-routine-modal"
      key="3"
      className="bg-zinc-700 rounded-lg"
      onPress={() => {
        setIsCancelRoutineModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  useEffect(() => {
    if (route.params!.exercises) {
      setSelectedExercises(route.params.exercises);
    }
  }, [route.params!.exercises]);

  const createRoutine = async () => {
    const routineTitle = routineTitleInputValue.trim();

    if (routineTitle === '') {
      Alert.alert('', 'Por favor, introduce un nombre para la nueva rutina.', [
        { text: 'OK' },
      ]);
      return;
    }

    if (selectedExercises.length === 0) {
      Alert.alert('', 'La rutina debe contener mínimo un ejercicio.', [
        { text: 'OK' },
      ]);
      return;
    }

    const { data: exists, error: errorTitle } = await useRoutineTitleExists(
      routineTitle,
      route.params.groupId
    );
    if (exists && !errorTitle) {
      Alert.alert(
        '',
        'El título introducido ya existe. Por favor, introduzca otro.',
        [{ text: 'OK' }]
      );
      return;
    }

    const allExerciseData = exerciseRefs.current.map((ref) =>
      ref!.getExerciseData()
    );

    const { error } = await useCreateRoutine(
      routineTitle,
      allExerciseData,
      route.params.groupId
    );

    resetState();
    if (!error) {
      emitter.emit('routineAdded');
      navigation.navigate('Routine');
    } else {
      Alert.alert('', 'Se ha producido un error al crear la rutina.', [
        { text: 'OK' },
      ]);
    }
  };

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4 gap-2 items-center">
        <HStack className="w-full gap-6 mb-4">
          <Button
            testID="cancel-routine"
            className="bg-transparent rounded-lg"
            onPress={() => {
              setIsCancelRoutineModalVisible(true);
            }}
          >
            <Text className="text-blue-500">Cancelar</Text>
          </Button>
          <Text className="text-xl">Crear Rutina</Text>
          <Button className="bg-blue-500 rounded-lg" onPress={createRoutine}>
            <Text className="text-white">Guardar</Text>
          </Button>
        </HStack>

        <Input
          className="mb-4"
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField
            placeholder="Título de la rutina"
            value={routineTitleInputValue}
            onChangeText={(value) =>
              setRoutineTitleInputValue(value.slice(0, MAX_LENGHT_TITLE))
            }
          />
        </Input>

        {selectedExercises.length === 0 ? (
          <>
            <Dumbbell color="gray" />
            <Text className="text-gray-400">
              Empieza agregando un ejercicio a tu rutina
            </Text>
          </>
        ) : (
          selectedExercises.map((exercise, index) => (
            <ExerciseResumeComponent
              key={index}
              ref={(el) => (exerciseRefs.current[index] = el)}
              id={exercise.id}
              name={exercise.name}
              thumbnailUrl={exercise.thumbnailUrl}
              restTime={exercise.restTime}
              notes={exercise.notes}
              primaryMuscleGroup={exercise.primaryMuscleGroup}
              sets={exercise.sets}
              targetReps={exercise.targetReps ?? 8}
            />
          ))
        )}

        <Button
          className="w-full bg-blue-500 rounded-lg mt-4"
          onPress={() =>
            navigation.navigate('AddExercise', {
              selectedExercises,
              groupId: route.params.groupId,
            })
          }
        >
          <Plus color="white" />
          <Text className="text-white ml-2">Agregar ejercicio</Text>
        </Button>

        <PopupBaseModal
          components={componentsCancelRoutinePopUpModal}
          isVisible={isCancelRoutineModalVisible}
          setIsModalVisible={setIsCancelRoutineModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default AddRoutine;
