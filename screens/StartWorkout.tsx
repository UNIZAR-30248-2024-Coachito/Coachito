import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps, RootStackParamList } from '@/types/navigation';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { Alert, ScrollView } from 'react-native';
import {
  useCreateWorkout,
  useFetchDetailsLastWorkout,
} from '@/hooks/workoutHook';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import DetailsExerciseWorkoutResumeComponent, {
  ExerciseResumeRef,
} from '@/components/workout/DetailsExerciseWorkoutResume';
import { emitter } from '@/utils/emitter';

const StartWorkout: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProp<RootStackParamList, 'StartWorkout'>>();
  const exerciseRefs = useRef<(ExerciseResumeRef | null)[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseResume[]>(
    []
  );
  const [isCancelRoutineModalVisible, setIsCancelWorkoutModalVisible] =
    useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const fetchExercises = async () => {
    setSelectedExercises([]);

    const { data, error } = await useFetchDetailsLastWorkout(
      route.params.routineId!
    );

    if (!error) {
      setSelectedExercises(data);
      setStartTime(Date.now());
      setTimerActive(true);
    } else {
      Alert.alert('', 'Se ha producido un error obteniendo los ejercicios.', [
        { text: 'OK' },
      ]);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [route.params.routineId]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive && startTime !== null) {
      interval = setInterval(() => {
        const currentDuration = Math.floor((Date.now() - startTime) / 1000);
        setDuration(currentDuration);
      }, 1000);
    } else if (!timerActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, startTime]);

  const handleStopTimer = () => {
    setTimerActive(false);
  };

  const handleResetTimer = () => {
    setStartTime(Date.now());
    setDuration(0);
    setTimerActive(true);
  };

  const resetExerciseSets = () => {
    exerciseRefs.current.forEach((exerciseRef) => {
      if (exerciseRef) {
        exerciseRef.resetToOneSet();
      }
    });
  };

  const saveWorkout = async () => {
    const allExerciseData = exerciseRefs.current.map((ref) =>
      ref!.getExerciseData()
    );

    const { error } = await useCreateWorkout(
      route.params.routineId,
      duration,
      allExerciseData
    );

    if (!error) {
      handleResetTimer();
      resetExerciseSets();
      emitter.emit('workoutFinished');
      navigation.navigate('Dashboard');
    } else {
      Alert.alert('', 'Se ha producido un error al guardar el entrenamiento.', [
        { text: 'OK' },
      ]);
    }
  };

  const componentsCancelRoutinePopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere descartar el entreno?
    </Text>,
    <Button
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsCancelWorkoutModalVisible(false);
        handleResetTimer();
        resetExerciseSets();
        navigation.navigate('Routine');
      }}
    >
      <Text className="text-white">Descartar entreno</Text>
    </Button>,
    <Button
      key="3"
      className="bg-zinc-700 rounded-lg"
      onPress={() => {
        setIsCancelWorkoutModalVisible(false);
        setTimerActive(true);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    return `${hours > 0 ? `${hours}h` : ''} ${minutes > 0 ? `${minutes}min` : ''} ${seconds > 0 ? `${seconds}s` : ''}`.trim();
  };

  return (
    <VStack className="flex-1 p-4 gap-2 items-center">
      <Text className="text-2xl text-white" bold>
        {route.params.routineName}
      </Text>

      <Text className="text-white mb-4">
        Tiempo transcurrido: {formatDuration(duration)}
      </Text>

      <HStack className="w-full gap-6">
        <Button
          className="bg-red-800 rounded-lg flex-1"
          onPress={() => {
            handleStopTimer();
            setIsCancelWorkoutModalVisible(true);
          }}
        >
          <Text className="text-white">Descartar</Text>
        </Button>
        <Button
          className="bg-blue-500 rounded-lg flex-1"
          onPress={() => {
            handleResetTimer();
            saveWorkout();
          }}
        >
          <Text className="text-white">Terminar</Text>
        </Button>
      </HStack>

      <ScrollView className="w-full">
        {selectedExercises.map((exercise, index) => (
          <DetailsExerciseWorkoutResumeComponent
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
        ))}
      </ScrollView>

      <PopupBaseModal
        components={componentsCancelRoutinePopUpModal}
        isVisible={isCancelRoutineModalVisible}
        setIsModalVisible={setIsCancelWorkoutModalVisible}
      />
    </VStack>
  );
};

export default StartWorkout;
