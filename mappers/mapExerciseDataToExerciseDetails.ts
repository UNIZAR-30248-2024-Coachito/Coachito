import { WorkoutExerciseDB } from '@/repositories/workoutRepository';
import { ExerciseDetails, SerieRecords } from '@/screens/DetailsExercise';
import { DataPoint } from '@/components/shared/CustomAreaChart';

export const mapExerciseDataToExerciseDetails = (
  rows: WorkoutExerciseDB[]
): ExerciseDetails => {
  const exercise = rows[0].exercises;

  let higherWeight = 0;
  let best1rm = 0;
  let bestSerieVolume = { weight: 0, reps: 0 };
  let bestTotalVolume = 0;

  const serieRecordsMap: { [key: number]: number } = {};
  const workoutsMap: {
    [key: string]: {
      date: Date;
      higherWeight: number;
      best1rm: number;
      bestVolume: number;
    };
  } = {};
  const weightDataPoints: DataPoint[] = [];
  const oneRMDataPoints: DataPoint[] = [];
  const volumeDataPoints: DataPoint[] = [];

  let totalWeight = 0;
  let totalOneRM = 0;
  let totalVolume = 0;

  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  rows.forEach((row) => {
    const weight = row.weight ?? 0;
    const reps = row.reps ?? row.target_number_reps ?? 0;
    const sets = row.sets ?? 1;
    const workoutDate = new Date(row.created_at);

    const totalReps = reps * sets;

    if (weight > 0 && reps > 0) {
      const workoutId = row.id;

      if (!workoutsMap[workoutId]) {
        workoutsMap[workoutId] = {
          date: workoutDate,
          higherWeight: 0,
          best1rm: 0,
          bestVolume: 0,
        };
      }

      workoutsMap[workoutId].higherWeight = Math.max(
        workoutsMap[workoutId].higherWeight,
        weight
      );
      const oneRepMax = weight * (1 + totalReps / 30);
      workoutsMap[workoutId].best1rm = Math.max(
        workoutsMap[workoutId].best1rm,
        oneRepMax
      );

      const serieVolume = weight * totalReps;
      bestTotalVolume += serieVolume;
      workoutsMap[workoutId].bestVolume = Math.max(
        workoutsMap[workoutId].bestVolume,
        serieVolume
      );

      higherWeight = Math.max(higherWeight, weight);
      best1rm = Math.max(best1rm, oneRepMax);

      const currentSerieVolume = weight * reps;
      if (currentSerieVolume > bestSerieVolume.weight * bestSerieVolume.reps) {
        bestSerieVolume = { weight, reps };
      }

      if (!serieRecordsMap[reps] || weight > serieRecordsMap[reps]) {
        serieRecordsMap[reps] = weight;
      }
    }
  });

  const serieRecords: SerieRecords[] = Object.keys(serieRecordsMap).map(
    (reps) => {
      const repsNumber = Number(reps);
      return {
        reps: repsNumber,
        personalBest: serieRecordsMap[repsNumber],
      };
    }
  );

  for (const workoutId in workoutsMap) {
    const { date, higherWeight, best1rm, bestVolume } = workoutsMap[workoutId];

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
    };
    const formattedDate = date
      .toLocaleDateString('es-ES', options)
      .replace('.', '');

    weightDataPoints.push({
      label: formattedDate,
      value: higherWeight,
    });

    oneRMDataPoints.push({
      label: formattedDate,
      value: best1rm,
    });

    volumeDataPoints.push({
      label: formattedDate,
      value: bestVolume,
    });

    totalWeight += higherWeight;
    totalOneRM += best1rm;
    totalVolume += bestVolume;
  }

  return {
    id: exercise.id,
    name: exercise.name,
    imageUrl: exercise.exercise_image_url,
    primaryMuscleGroup: exercise.muscle_groups.name,
    higherWeight,
    best1rm,
    bestSerieVolume: `${bestSerieVolume.weight}kg x ${bestSerieVolume.reps}`,
    bestTotalVolume,
    serieRecords,
    dataPoints: [
      { dataPoints: weightDataPoints, dataTotal: `${totalWeight} kg` },
      { dataPoints: oneRMDataPoints, dataTotal: `${totalOneRM} kg` },
      { dataPoints: volumeDataPoints, dataTotal: `${totalVolume} kg` },
    ],
  };
};
