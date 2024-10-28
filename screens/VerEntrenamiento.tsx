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

import { ArrowLeft } from 'lucide-react-native';
import ExerciseResumeComponent, {
  ExerciseResume,
} from '@/components/routine/ExerciseResume';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from '@/components/workout/WorkoutHeaderResume';
import WorkoutDivisionComponent from '@/components/workout/WorkoutDivision';
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

  const fetchExercises = async () => {
    const { exercisesResumes, error: errorRoutines } =
      await useFetchDetailsWorkout(workoutId);

    if (!errorRoutines) {
      setWorkoutResume(exercisesResumes!);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [workoutId]);

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

        <Text className="text-gray-400 mt-4 mb-4">Ejercicios</Text>

        {workoutResume?.exercises!.map((exercise, index) => (
          <ExerciseResumeComponent
            key={index}
            id={exercise.id}
            name={exercise.name}
            thumbnailUrl={exercise.thumbnailUrl}
            restTime={exercise.restTime}
            notes={exercise.notes}
            sets={exercise.sets}
            primaryMuscleGroup={exercise.primaryMuscleGroup}
          />
        ))}
      </VStack>
    </ScrollView>
  );
};

export default VerEntrenamiento;
