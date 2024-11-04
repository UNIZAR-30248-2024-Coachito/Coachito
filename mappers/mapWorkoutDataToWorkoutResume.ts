import { ExerciseResume } from '@/components/routine/ExerciseResume';
import { WorkoutHeaderResume } from '@/components/workout/WorkoutHeaderResume';
import { WorkoutDataDB } from '@/repositories/workoutRepository';
import { WorkoutResume } from '@/screens/DetailsWorkout';
import { convertIntervalToMinutes } from '@/utils/interval';
import { mapWorkoutDataToExerciseResumeArray } from './mapWorkoutDataToDetailsRoutinesResume';

export const mapWorkoutDataToWorkoutResume = (
  workoutDataDB: WorkoutDataDB
): WorkoutResume => {
  const workoutHeaderResume: WorkoutHeaderResume = {
    workoutId: workoutDataDB.id,
    workoutName: workoutDataDB.workout_templates.name,
    workoutDate: new Date(workoutDataDB.created_at),
    workoutTime: convertIntervalToMinutes(workoutDataDB.duration),
    workoutVolume: workoutDataDB.volume,
    workoutSeries: workoutDataDB.workout_exercises.reduce(
      (totalSeries, exercise) => totalSeries + exercise.sets,
      0
    ),
  };

  const exercises: ExerciseResume[] =
    mapWorkoutDataToExerciseResumeArray(workoutDataDB);

  return {
    header: workoutHeaderResume,
    exercises: exercises,
  };
};
