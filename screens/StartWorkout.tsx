import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps, RootStackParamList } from '@/types/navigation';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { ScrollView } from 'react-native';
import {
  useCreateWorkout,
  useFetchDetailsLastWorkout,
} from '@/hooks/workoutHook';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import DetailsExerciseWorkoutResumeComponent, {
  ExerciseResumeRef,
} from '@/components/workout/DetailsExerciseWorkoutResume';
import Timer from '@/components/workout/Timer';
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
  const [timerActive, setTimerActive] = useState(true);
  const [timerKey, setTimerKey] = useState(0);
  const [duration, setDuration] = useState(0);

  const fetchExercises = async () => {
    const { data, error } = await useFetchDetailsLastWorkout(
      route.params.routineId!
    );

    if (!error) {
      setSelectedExercises(data);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleStopTimer = () => {
    setTimerActive(false);
  };

  const handleResetTimer = () => {
    setTimerKey((prevKey) => prevKey + 1);
    setTimerActive(true);
  };

  const handleDurationUpdate = (time: number) => {
    setDuration(time);
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
      emitter.emit('workoutFinished');
      navigation.navigate('Dashboard');
    } else {
      alert('Se ha producido un error al guardar el entrenamiento.');
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

  return (
    <VStack className="flex-1 p-4 gap-2 items-center">
      <Text className="text-2xl text-white" bold>
        {route.params.routineName}
      </Text>

      <Timer
        key={timerKey}
        active={timerActive}
        onTimeUpdate={handleDurationUpdate}
      />

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
