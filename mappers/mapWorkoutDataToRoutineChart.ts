import { DataChartProps, DataPoint } from '@/components/shared/AreaChart';
import { WorkoutDataDB } from '@/repositories/workoutRepository';

export const mapWorkoutDataToRoutineChart = (
  workoutDataDB: WorkoutDataDB[]
): DataChartProps[] => {
  const volumeData: DataPoint[] = [];
  const repetitionsData: DataPoint[] = [];
  const durationData: DataPoint[] = [];

  let totalVolume = 0;
  let totalReps = 0;
  let totalDurationMinutes = 0;

  workoutDataDB.forEach((workout) => {
    const date = new Date(workout.created_at);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
    };
    const formattedDate = date
      .toLocaleDateString('es-ES', options)
      .replace('.', '');

    volumeData.push({ label: formattedDate, value: workout.volume });
    totalVolume += workout.volume;

    const totalRepsForWorkout = workout.workout_exercises.reduce(
      (acc, exercise) => {
        return acc + exercise.reps * exercise.sets;
      },
      0
    );

    repetitionsData.push({ label: formattedDate, value: totalRepsForWorkout });
    totalReps += totalRepsForWorkout;

    const [hours, minutes] = workout.duration.split(':').map(Number);
    const totalDurationInMinutes = hours * 60 + minutes;
    durationData.push({ label: formattedDate, value: totalDurationInMinutes });
    totalDurationMinutes += totalDurationInMinutes;
  });

  const totalHours = Math.floor(totalDurationMinutes / 60);
  const remainingMinutes = totalDurationMinutes % 60;
  const durationString = `${totalHours}h y ${remainingMinutes} min`;

  return [
    { dataPoints: volumeData, dataTotal: `${totalVolume} kg` },
    { dataPoints: repetitionsData, dataTotal: `${totalReps} reps` },
    { dataPoints: durationData, dataTotal: durationString },
  ];
};
