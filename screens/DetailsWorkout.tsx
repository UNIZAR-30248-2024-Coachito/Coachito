import React, { useState, useEffect } from 'react';
import { Text } from '../components/ui/text';
import { VStack } from '../components/ui/vstack';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { Alert, ScrollView } from 'react-native';
import { useFetchDetailsWorkout } from '@/hooks/workoutHook';
import ExercisesRoutineResumeComponent, {
  ExerciseResume,
} from '@/components/routine/ExercisesRoutineResume';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from '@/components/workout/WorkoutHeaderResume';
import WorkoutDivisionComponent, {
  ExerciseProportion,
} from '@/components/workout/WorkoutDivision';
import { Box } from '@/components/ui/box';

export interface WorkoutResume {
  workout_header_resume: WorkoutHeaderResume;
  exercise_resume: ExerciseResume[];
}

const DetailsWorkout: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'DetailsWorkout'>>();
  const {
    workoutId,
    textColor,
    backgroundColor,
    backgroundColorEntrenamiento,
  } = route.params;
  const [workoutResume, setWorkoutResume] = useState<WorkoutResume>();
  const [exerciseProportionData, setExerciseProportionData] = useState<
    ExerciseProportion[]
  >([]);

  const calculateExerciseProportions = (
    exercises: ExerciseResume[]
  ): ExerciseProportion[] => {
    const groupedExercises: { [key: string]: number } = exercises.reduce(
      (acc, exercise) => {
        if (acc[exercise.primaryMuscleGroup]) {
          acc[exercise.primaryMuscleGroup] += exercise.sets!.length;
        } else {
          acc[exercise.primaryMuscleGroup] = exercise.sets!.length;
        }
        return acc;
      },
      {} as { [key: string]: number }
    );

    const totalSeries = Object.values(groupedExercises).reduce(
      (acc, seriesCount) => acc + seriesCount,
      0
    );

    return Object.keys(groupedExercises).map((name) => ({
      name,
      proportion:
        totalSeries > 0
          ? parseFloat(
              ((groupedExercises[name] / totalSeries) * 100).toFixed(2)
            )
          : 0,
    }));
  };

  const fetchExercises = async () => {
    const { data, error } = await useFetchDetailsWorkout(workoutId);

    if (!error) {
      setWorkoutResume(data);
      const proportionData = calculateExerciseProportions(data.exercise_resume);
      setExerciseProportionData(proportionData);
    } else {
      Alert.alert('', 'Se ha producido un error al obtener los datos.', [
        { text: 'OK' },
      ]);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [workoutId]);

  return (
    <ScrollView className="flex-1">
      <VStack
        style={{ backgroundColor: backgroundColor }}
        className="p-4 gap-4"
      >
        <Box className="flex justify-center">
          <Text
            style={{ color: textColor }}
            className="text-xl font-bold text-center"
          >
            Detalles de entrenamiento
          </Text>
        </Box>

        {workoutResume && (
          <>
            <WorkoutHeaderResumeComponent
              textColor={textColor}
              backgroundColor={backgroundColor}
              workoutId={workoutResume.workout_header_resume.workoutId}
              workoutName={workoutResume.workout_header_resume.workoutName}
              workoutDate={workoutResume.workout_header_resume.workoutDate}
              workoutTime={workoutResume.workout_header_resume.workoutTime}
              workoutVolume={workoutResume.workout_header_resume.workoutVolume}
              workoutSeries={workoutResume.workout_header_resume.workoutSeries}
            />
            <WorkoutDivisionComponent
              exercisesProportion={exerciseProportionData}
              textColor={textColor}
            />
          </>
        )}

        <Text className="text-gray-400">Ejercicios</Text>

        {workoutResume?.exercise_resume.map((exercise, index) => (
          <ExercisesRoutineResumeComponent
            backgroundColor={backgroundColorEntrenamiento}
            textColor={textColor}
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
