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
import ExerciseResumeComponent, {
  ExerciseResume,
} from '@/components/routine/ExerciseResume';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react-native';
import SlideUpBaseModal from '@/components/shared/SlideUpBaseModal';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { useDeleteWorkoutTemplate } from '@/hooks/workoutTemplateHook';
import { emitter } from '@/utils/emitter';
import RoutineChart, {
  DataChartProps,
  DataPoint,
} from '@/components/shared/AreaChart';

const DetailsRoutine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<RootStackParamList, 'DetailsRoutine'>>();
  const { templateId, myRoutineName } = route.params;

  const [chartDetailsWorkout, setChartDetailsWorkout] = useState<
    DataChartProps[]
  >([]);
  const [dataChartTotal, setDataChartTotal] = useState<string>('');
  const [dataChartPoints, setDataChartPoints] = useState<DataPoint[]>([]);
  const [exercises, setExercises] = useState<ExerciseResume[]>([]);
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [activeButton, setActiveButton] = useState('volumen');

  const fetchRoutineChartDetailsWorkout = async () => {
    const { chartDetailsWorkout, error: errorChartDetailsWorkout } =
      await useFetchRoutineWorkouts(templateId);

    if (!errorChartDetailsWorkout) {
      setChartDetailsWorkout(chartDetailsWorkout!);

      if (chartDetailsWorkout && chartDetailsWorkout.length > 0) {
        setDataChartPoints(chartDetailsWorkout[0].dataPoints);
        setDataChartTotal(chartDetailsWorkout[0].dataTotal);
      }
    }
  };

  const fetchExercises = async () => {
    const { exercisesResumes, error: errorRoutines } =
      await useFetchDetailsLastWorkout(templateId);

    if (!errorRoutines) {
      setExercises(exercisesResumes!);
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
    }
  };

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="2"
      className="bg-transparent"
      onPress={() =>
        navigation.navigate('EditRoutine', {
          routineId: templateId,
          routineName: myRoutineName,
          exercises,
        })
      }
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
      <VStack className="p-4">
        <HStack className="justify-between">
          <Text className="text-xl font-bold text-white">{myRoutineName}</Text>
          <Button
            className="bg-transparent"
            onPress={() => {
              setIsSlideUpModalVisible(true);
            }}
          >
            <MoreHorizontal color="white" />
          </Button>
        </HStack>

        <Button
          className="bg-blue-500 rounded-lg w-full mb-4"
          onPress={() =>
            navigation.navigate('StartWorkout', {
              routineId: templateId,
              routineName: myRoutineName,
            })
          }
        >
          <Text className="text-white">Empezar Rutina</Text>
        </Button>

        <RoutineChart dataPoints={dataChartPoints} dataTotal={dataChartTotal} />
        <HStack className="justify-between mb-4">
          <Button
            className={
              activeButton === 'volumen'
                ? 'rounded-lg bg-blue-500'
                : 'rounded-lg bg-background-50'
            }
            onPress={() => {
              setActiveButton('volumen');
              setDataChartPoints(chartDetailsWorkout[0].dataPoints);
              setDataChartTotal(chartDetailsWorkout[0].dataTotal);
            }}
          >
            <Text className="text-white">Volumen</Text>
          </Button>
          <Button
            className={
              activeButton === 'repeticiones'
                ? 'rounded-lg bg-blue-500'
                : 'rounded-lg bg-background-50'
            }
            onPress={() => {
              setActiveButton('repeticiones');
              setDataChartPoints(chartDetailsWorkout[1].dataPoints);
              setDataChartTotal(chartDetailsWorkout[1].dataTotal);
            }}
          >
            <Text className="text-white">Repeticiones</Text>
          </Button>
          <Button
            className={
              activeButton === 'duracion'
                ? 'rounded-lg bg-blue-500'
                : 'rounded-lg bg-background-50'
            }
            onPress={() => {
              setActiveButton('duracion');
              setDataChartPoints(chartDetailsWorkout[2].dataPoints);
              setDataChartTotal(chartDetailsWorkout[2].dataTotal);
            }}
          >
            <Text className="text-white">Duración</Text>
          </Button>
        </HStack>

        <HStack className="justify-between mb-4">
          <Text className="text-gray-400 mt-4">Ejercicios</Text>
          <Button
            className="bg-transparent"
            onPress={() =>
              navigation.navigate('EditRoutine', {
                routineId: templateId,
                routineName: myRoutineName,
                exercises,
              })
            }
          >
            <Text className="text-blue-500">Editar rutina</Text>
          </Button>
        </HStack>

        {exercises!.map((exercise, index) => (
          <ExerciseResumeComponent
            key={index}
            id={exercise.id}
            name={exercise.name}
            thumbnailUrl={exercise.thumbnailUrl}
            restTime={exercise.restTime}
            notes={exercise.notes}
            primaryMuscleGroup={exercise.primaryMuscleGroup}
            sets={exercise.sets}
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
