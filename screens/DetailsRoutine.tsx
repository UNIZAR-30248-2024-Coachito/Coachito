import React, { useEffect, useState } from 'react';
import '../styles.css';
import { Text } from '../components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';
import { VStack } from '@/components/ui/vstack';
import { NavigationProps, RootStackParamList } from '@/types/navigation';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import {
  useFetchDetailsLastWorkout,
  useFetchRoutineWorkouts,
} from '@/hooks/workoutHook';
import { HStack } from '@/components/ui/hstack';
import ExercisesRoutineResumeComponent, {
  ExerciseResume,
} from '@/components/routine/ExercisesRoutineResume';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react-native';
import SlideUpBaseModal from '@/components/shared/SlideUpBaseModal';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { useDeleteWorkoutTemplate } from '@/hooks/workoutTemplateHook';
import { emitter } from '@/utils/emitter';
import CustomAreaChart, {
  DataChartProps,
} from '@/components/shared/CustomAreaChart';
import { Alert } from 'react-native';

const DetailsRoutine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<RootStackParamList, 'DetailsRoutine'>>();
  const { templateId, myRoutineName } = route.params;

  const [chartDetailsWorkout, setChartDetailsWorkout] = useState<
    DataChartProps[]
  >([]);
  const [exercises, setExercises] = useState<ExerciseResume[]>([]);
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const buttons = ['Volumen', 'Repeticiones', 'Duración'];

  const fetchRoutineChartDetailsWorkout = async () => {
    const { data, error } = await useFetchRoutineWorkouts(templateId);

    if (!error) {
      setChartDetailsWorkout(data);
    } else {
      Alert.alert(
        '',
        'Se ha producido un error obteniendo los datos de la gráfica.',
        [{ text: 'OK' }]
      );
    }
  };

  const fetchExercises = async () => {
    const { data, error } = await useFetchDetailsLastWorkout(templateId);

    if (!error) {
      setExercises(data);
    } else {
      Alert.alert('', 'Se ha producido un error obteniendo los ejercicios.', [
        { text: 'OK' },
      ]);
    }
  };

  useEffect(() => {
    fetchRoutineChartDetailsWorkout();
    fetchExercises();
  }, [templateId]);

  const deleteRoutine = async () => {
    const { error } = await useDeleteWorkoutTemplate(templateId);

    if (!error) {
      emitter.emit('routineDeleted');
      navigation.navigate('Routine');
    } else {
      Alert.alert('', 'Se ha producido un error al eliminar la rutina.', [
        { text: 'OK' },
      ]);
    }
  };

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="2"
      className="bg-transparent"
      onPress={() => {
        navigation.navigate('EditRoutine', {
          routineId: templateId,
          routineName: myRoutineName,
        });
      }}
    >
      <Pencil color="white" />
      <Text className="text-white ml-4">Editar rutina</Text>
    </Button>,
    <Button
      key="3"
      className="bg-transparent"
      onPress={() => {
        setIsDeleteModalVisible(true);
        setIsSlideUpModalVisible(false);
      }}
    >
      <Trash color="red" />
      <Text className="text-red-600 ml-4">Borrar rutina</Text>
    </Button>,
  ];

  const componentsDeleteGroupPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere borrar la rutina?
    </Text>,
    <Button
      testID="delete-button"
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        deleteRoutine();
      }}
    >
      <Text className="text-white">Borrar rutina</Text>
    </Button>,
    <Button
      key="3"
      className="bg-zinc-700 rounded-lg"
      onPress={() => {
        setIsDeleteModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4 gap-4">
        <HStack className="justify-between">
          <Text className="text-xl font-bold text-white">{myRoutineName}</Text>
          <Button
            testID="modal-button"
            className="bg-transparent"
            onPress={() => {
              setIsSlideUpModalVisible(true);
            }}
          >
            <MoreHorizontal color="white" />
          </Button>
        </HStack>

        <Button
          className="bg-blue-500 rounded-lg w-full"
          onPress={() =>
            navigation.navigate('StartWorkout', {
              routineId: templateId,
              routineName: myRoutineName,
            })
          }
        >
          <Text className="text-white">Empezar Entrenamiento</Text>
        </Button>

        <CustomAreaChart data={chartDetailsWorkout} buttons={buttons} />

        <HStack className="justify-between items-center">
          <Text className="text-gray-400">Ejercicios</Text>
          <Button
            className="bg-transparent"
            onPress={() =>
              navigation.navigate('EditRoutine', {
                routineId: templateId,
                routineName: myRoutineName,
              })
            }
          >
            <Text className="text-blue-500">Editar rutina</Text>
          </Button>
        </HStack>

        {exercises!.map((exercise, index) => (
          <ExercisesRoutineResumeComponent
            key={index}
            id={exercise.id}
            name={exercise.name}
            thumbnailUrl={exercise.thumbnailUrl}
            restTime={exercise.restTime}
            notes={exercise.notes}
            primaryMuscleGroup={exercise.primaryMuscleGroup}
            sets={exercise.sets}
            targetReps={exercise.targetReps}
          />
        ))}

        <SlideUpBaseModal
          buttons={buttonsSlideUpModal}
          title={myRoutineName}
          isVisible={isSlideUpModalVisible}
          setIsModalVisible={setIsSlideUpModalVisible}
        />

        <PopupBaseModal
          components={componentsDeleteGroupPopUpModal}
          isVisible={isDeleteModalVisible}
          setIsModalVisible={setIsDeleteModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default DetailsRoutine;
