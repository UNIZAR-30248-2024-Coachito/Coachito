import React, { useState, useEffect } from 'react';
import { Text } from '../components/ui/text';
import { VStack } from '../components/ui/vstack';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { ScrollView } from 'react-native';
import { useFetchDetailsWorkout } from '@/hooks/workoutHook';
import ExercisesRoutineResumeComponent, {
  ExerciseResume,
} from '@/components/routine/ExercisesRoutineResume';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from '@/components/workout/WorkoutHeaderResume';
import WorkoutDivisionComponent from '@/components/workout/WorkoutDivision';
import { mapToExerciseProportions } from '@/mappers/mapExerciseResumeToExerciseProportion';
import { Box } from '@/components/ui/box';

export interface WorkoutResume {
  workout_header_resume: WorkoutHeaderResume;
  exercise_resume: ExerciseResume[];
}

const DetailsWorkout: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DetailsWorkout'>>();
  const { workoutId } = route.params;
  const [workoutResume, setWorkoutResume] = useState<WorkoutResume>();

  const fetchExercises = async () => {
    const { data, error } = await useFetchDetailsWorkout(workoutId);

    if (!error) {
      setWorkoutResume(data);
    } else {
      alert('Se ha producido un error al obtener los datos.');
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [workoutId]);

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4 gap-4">
        <Box className="flex justify-center">
          <Text className="text-xl font-bold text-white text-center">
            Detalles de entrenamiento
          </Text>
        </Box>

        {workoutResume && (
          <>
            <WorkoutHeaderResumeComponent
              workoutId={workoutResume.workout_header_resume.workoutId}
              workoutName={workoutResume.workout_header_resume.workoutName}
              workoutDate={workoutResume.workout_header_resume.workoutDate}
              workoutTime={workoutResume.workout_header_resume.workoutTime}
              workoutVolume={workoutResume.workout_header_resume.workoutVolume}
              workoutSeries={workoutResume.workout_header_resume.workoutSeries}
            />
            <WorkoutDivisionComponent
              exercisesProportion={mapToExerciseProportions(
                workoutResume?.exercise_resume
              )}
            />
          </>
        )}

        <Text className="text-gray-400">Ejercicios</Text>

        {workoutResume?.exercise_resume.map((exercise, index) => (
          <ExercisesRoutineResumeComponent
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

export default DetailsWorkout;
