import React, { useRef, useState } from 'react';
import '../styles.css';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { InputField, Input } from '../components/ui/input';
import { Plus } from 'lucide-react-native';
import { Dumbbell } from 'lucide-react-native';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NavigationProps, RootStackParamList } from '@/types/navigation';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import ExerciseResumeComponent, {
  ExerciseResumeRef,
} from '@/components/exercise/DetailsExerciseResume';
import { useUpdateRoutine } from '@/hooks/routineHook';
import { ScrollView } from 'react-native';
import { useFetchDetailsWorkout } from '@/hooks/workoutHook';
import { ExerciseResume } from '@/components/detailsRoutine/ExerciseResume';

const EditRoutine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<RootStackParamList, 'EditRoutine'>>();
  const exerciseRefs = useRef<(ExerciseResumeRef | null)[]>([]);
  const [routineTitleInputValue, setroutineTitleInputValue] = useState(
    route.params.routineName
  );
  const [selectedExercises, setSelectedExercises] = useState<ExerciseResume[]>(
    []
  );
  const [isCancelRoutineModalVisible, setIsCancelRoutineModalVisible] =
    useState(false);

  const fetchExercises = async () => {
    const { myRoutineResume, error: errorRoutines } =
      await useFetchDetailsWorkout(route.params.routineId!);

    if (!errorRoutines) {
      setSelectedExercises(myRoutineResume!);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setroutineTitleInputValue(route.params.routineName);
      fetchExercises();
    }, [route.params.routineId])
  );

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
      alert('Por favor, introduce un nombre para la rutina.');
      return;
    }

    if (selectedExercises.length === 0) {
      alert('La rutina debe contener mínimo un ejercicio.');
      return;
    }

    const allExerciseData = exerciseRefs.current.map((ref) =>
      ref!.getExerciseData()
    );

    const { error } = await useUpdateRoutine(
      route.params.routineId!,
      routineTitle,
      allExerciseData
    );

    if (!error) {
      navigation.navigate('Routine');
    } else {
      alert('Se ha producido un error al guardar la rutina.');
    }
  };

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4 gap-2 items-center">
        <HStack className="w-full gap-6 mb-4">
          <Button
            className="bg-transparent rounded-lg"
            onPress={() => {
              setIsCancelRoutineModalVisible(true);
            }}
          >
            <Text className="text-blue-500">Cancelar</Text>
          </Button>
          <Text className="text-xl">Editar Rutina</Text>
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
            onChangeText={setroutineTitleInputValue}
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
          components={componentsCancelRoutinePopUpModal}
          isVisible={isCancelRoutineModalVisible}
          setIsModalVisible={setIsCancelRoutineModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default EditRoutine;
