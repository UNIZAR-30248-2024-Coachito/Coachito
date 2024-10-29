import React, { useEffect, useRef, useState } from 'react';
import '../styles.css';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProps, RootStackParamList } from '@/types/navigation';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { ExerciseResumeRef } from '@/components/exercise/DetailsExerciseResume';
import { ScrollView } from 'react-native';
import {
  useCreateWorkout,
  useFetchDetailsLastWorkout,
} from '@/hooks/workoutHook';
import { ExerciseResume } from '@/components/routine/ExerciseResume';
import DetailsExerciseWorkoutResumeComponent from '@/components/workout/DetailsExerciseWorkoutResume';
import Timer from '@/components/workout/Timer';

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
    const { exercisesResumes, error: errorRoutines } =
      await useFetchDetailsLastWorkout(route.params.routineId!);

    if (!errorRoutines) {
      setSelectedExercises(exercisesResumes!);
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
      navigation.navigate('Routine');
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
    <ScrollView className="flex-1">
      <VStack className="p-4 gap-4 items-center">
        <Text className="text-xl text-white" bold>
          {route.params.routineName}
        </Text>
        <HStack className="w-full flex-1 justify-between gap-6">
          <Button
            className="bg-red-800 rounded-lg"
            onPress={() => {
              handleStopTimer();
              setIsCancelWorkoutModalVisible(true);
            }}
          >
            <Text className="text-white">Descartar</Text>
          </Button>
          <Button
            className="bg-blue-500 rounded-lg"
            onPress={() => {
              handleStopTimer();
              handleResetTimer();
              saveWorkout();
              navigation.navigate('Routine');
            }}
          >
            <Text className="text-white">Terminar</Text>
          </Button>
        </HStack>
        <Timer
          key={timerKey}
          active={timerActive}
          onTimeUpdate={handleDurationUpdate}
        />

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

        <PopupBaseModal
          components={componentsCancelRoutinePopUpModal}
          isVisible={isCancelRoutineModalVisible}
          setIsModalVisible={setIsCancelWorkoutModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default StartWorkout;
