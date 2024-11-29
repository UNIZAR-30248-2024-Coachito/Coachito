import React, { useRef, useState, useEffect, useCallback } from 'react';
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
import ExerciseResumeComponent, {
  ExerciseResumeRef,
} from '@/components/exercise/ExerciseResume';
import { Alert, ScrollView } from 'react-native';
import { useFetchDetailsLastWorkout } from '@/hooks/workoutHook';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import { emitter } from '@/utils/emitter';
import { useUpdateRoutine } from '@/hooks/workoutTemplateHook';

const EditRoutine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditRoutine'>>();
  const exerciseRefs = useRef<(ExerciseResumeRef | null)[]>([]);
  const [routineTitleInputValue, setRoutineTitleInputValue] = useState(
    route.params.routineName
  );

  const backgroundColorPopUp = route.params.backgroundColorPopUp;
  const backgroundColor = route.params.backgroundColor;
  const textColor = route.params.textColor;

  const [selectedExercises, setSelectedExercises] = useState<ExerciseResume[]>(
    []
  );
  const [isCancelRoutineModalVisible, setIsCancelRoutineModalVisible] =
    useState(false);

  const fetchExercises = useCallback(async () => {
    const { data, error } = await useFetchDetailsLastWorkout(
      route.params.routineId!
    );

    if (!error) {
      exerciseRefs.current = [];
      setSelectedExercises(data);
    } else {
      Alert.alert('', 'Se ha producido un error al obtener los ejercicios.', [
        { text: 'OK' },
      ]);
    }
  }, [route.params.routineId]);

  const updateExercises = useCallback((exercises: ExerciseResume[]) => {
    setSelectedExercises(exercises);
  }, []);

  useEffect(() => {
    setRoutineTitleInputValue(route.params.routineName);
    fetchExercises();
    const exercisesUpdateListener = emitter.addListener(
      'exercisesUpdated',
      updateExercises
    );

    return () => {
      exercisesUpdateListener?.remove();
    };
  }, [fetchExercises, updateExercises, route.params.routineId]);

  const componentsCancelRoutinePopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere descartar los cambios?
    </Text>,
    <Button
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsCancelRoutineModalVisible(false);
        navigation.navigate('Routine');
      }}
    >
      <Text className="text-white">Descartar cambios</Text>
    </Button>,
    <Button
      testID="cancel-button-modal"
      key="3"
      className="bg-zinc-700 rounded-lg"
      onPress={() => {
        setIsCancelRoutineModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  const updateRoutine = async () => {
    const routineTitle = routineTitleInputValue!.trim();

    if (routineTitle === '') {
      Alert.alert('', 'Por favor, introduce un nombre para la rutina.', [
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

    const allExerciseData = exerciseRefs.current
      .filter((ref) => ref !== null)
      .map((ref) => ref!.getExerciseData());

    const { error } = await useUpdateRoutine(
      route.params.routineId!,
      routineTitle,
      allExerciseData
    );

    if (error) {
      Alert.alert('', 'Se ha producido un error al guardar la rutina.', [
        { text: 'OK' },
      ]);
    } else {
      emitter.emit('routineRenamed');
      navigation.navigate('Routine');
    }
  };

  return (
    <ScrollView className="flex-1">
      <VStack
        style={{ backgroundColor: backgroundColor }}
        className="p-4 gap-2 items-center"
      >
        <HStack className="w-full gap-6 mb-4">
          <Button
            className="bg-transparent rounded-lg"
            onPress={() => {
              setIsCancelRoutineModalVisible(true);
            }}
          >
            <Text className="text-blue-500">Cancelar</Text>
          </Button>
          <Text style={{ color: textColor }} className="text-xl">
            Editar Rutina
          </Text>
          <Button className="bg-blue-500 rounded-lg" onPress={updateRoutine}>
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
            value={routineTitleInputValue!}
            onChangeText={setRoutineTitleInputValue}
          />
        </Input>

        {!selectedExercises || selectedExercises.length === 0 ? (
          <>
            <Dumbbell color="gray" />
            <Text className="text-gray-400">
              Empieza agregando un ejercicio a tu rutina
            </Text>
          </>
        ) : (
          selectedExercises.map((exercise, index) => (
            <ExerciseResumeComponent
              backgroundColor={backgroundColor}
              textColor={textColor}
              key={index}
              ref={(el) => (exerciseRefs.current[index] = el)}
              id={exercise.id}
              name={exercise.name}
              thumbnailUrl={exercise.thumbnailUrl}
              restTime={exercise.restTime}
              notes={exercise.notes}
              primaryMuscleGroup={exercise.primaryMuscleGroup}
              sets={exercise.sets}
              targetReps={exercise.targetReps}
            />
          ))
        )}

        <Button
          className="w-full bg-blue-500 rounded-lg mt-4"
          onPress={() =>
            navigation.navigate('AddExerciseEdit', {
              selectedExercises,
              routineId: route.params.routineId,
              routineName: route.params.routineName,
            })
          }
        >
          <Plus color="white" />
          <Text className="text-white ml-2">Agregar ejercicio</Text>
        </Button>

        <PopupBaseModal
          backgroundColor={backgroundColorPopUp}
          components={componentsCancelRoutinePopUpModal}
          isVisible={isCancelRoutineModalVisible}
          setIsModalVisible={setIsCancelRoutineModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default EditRoutine;
