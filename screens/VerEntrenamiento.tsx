import React, { useState, useEffect } from 'react';
import { Text } from '../components/ui/text';
import { VStack } from '../components/ui/vstack';
import { Button } from '../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { NavigationProps } from '@/types/navigation';
import { ScrollView } from 'react-native';

import { useFetchDetailsWorkout } from '@/hooks/workoutHook';

import { ArrowLeft, MoreHorizontal, Pencil } from 'lucide-react-native';
import SlideUpBaseModal from '@/components/shared/SlideUpBaseModal';
import ExerciseResumeComponent, {
  ExerciseResume,
} from '@/components/detailsRoutine/ExerciseResume';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from '@/components/workout/WorkoutHeaderResume';
import WorkoutDivisionComponent from '@/components/verEntrenamiento/WorkoutDivision';
import { HStack } from '@/components/ui/hstack';
import { mapToExerciseProportions } from '@/mappers/mapExerciseResumeToExerciseProportion';

export interface WorkoutResume {
  header: WorkoutHeaderResume;
  exercises: ExerciseResume[];
}

const VerEntrenamiento: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'VerEntrenamiento'>>();
  const navigation = useNavigation<NavigationProps>();
  const { workoutId } = route.params;
  const [workoutResume, setWorkoutResume] = useState<WorkoutResume | null>(
    null
  );
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);

  const fetchExercises = async () => {
    const { exercisesResumes, error: errorRoutines } =
      await useFetchDetailsWorkout(workoutId);

    if (!errorRoutines) {
      console.log(exercisesResumes!);
      setWorkoutResume(exercisesResumes!);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [workoutId]);

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="2"
      className="bg-transparent mt-4"
      onPress={() => navigation.navigate('Dashboard')}
    >
      <Pencil color="white" />
      <Text className="text-white ml-4">Editar entrenamiento</Text>
    </Button>,
  ];

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        <HStack className="justify-between">
          <Button
            className="bg-transparent"
            onPress={() => {
              navigation.navigate('Dashboard');
            }}
          >
            <ArrowLeft color="white" />
          </Button>
          <Text className="text-xl font-bold text-white">
            Detalles de entrenamiento
          </Text>
          <Button
            className="bg-transparent"
            onPress={() => {
              setIsSlideUpModalVisible(true);
            }}
          >
            <MoreHorizontal color="white" />
          </Button>
        </HStack>

        {workoutResume && (
          <>
            <WorkoutHeaderResumeComponent
              workoutId={workoutResume.header.workoutId}
              workoutName={workoutResume.header.workoutName}
              workoutDate={workoutResume.header.workoutDate}
              workoutTime={workoutResume.header.workoutTime}
              workoutVolume={workoutResume.header.workoutVolume}
              workoutSeries={workoutResume.header.workoutSeries}
            />
            <WorkoutDivisionComponent
              exercisesProportion={mapToExerciseProportions(
                workoutResume?.exercises
              )}
            />
          </>
        )}

        <HStack className="justify-between mb-4">
          <Text className="text-gray-400 mt-4">Ejercicios</Text>
          <Button
            className="bg-transparent"
            //onPress={() => navigation.navigate('EditRoutine')}
          >
            <Text className="text-blue-500">Editar rutina</Text>
          </Button>
        </HStack>

        {workoutResume?.exercises!.map((exercise, index) => (
          <ExerciseResumeComponent
            key={index}
            name={exercise.name}
            thumbnailUrl={exercise.thumbnailUrl}
            restTime={exercise.restTime}
            notes={exercise.notes}
            series={exercise.series}
            primary_muscle={exercise.primary_muscle}
          />
        ))}

        <SlideUpBaseModal
          buttons={buttonsSlideUpModal}
          title={
            workoutResume !== null ? workoutResume!.header.workoutName : ''
          }
          isVisible={isSlideUpModalVisible}
          setIsModalVisible={setIsSlideUpModalVisible}
        />
      </VStack>
    </ScrollView>
  );
};

export default VerEntrenamiento;
