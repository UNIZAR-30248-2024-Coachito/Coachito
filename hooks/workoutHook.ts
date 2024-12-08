import { supabase } from '@/api/supabaseClient';
import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';

// Obtener los detalles del último entrenamiento
const useFetchDetailsLastWorkout = async (templateId: number) => {
  try {
    const { data, error } = await supabase.rpc('get_last_workout_details', {
      templ_id: templateId, // Pasamos el parámetro esperado
    });

    if (error) {
      console.error('Error fetching last workout details:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error fetching last workout details:', error);
    return { data: null, error };
  }
};

// Obtener los detalles de un entrenamiento específico
const useFetchDetailsWorkout = async (id: number) => {
  try {
    const { data, error } = await supabase.rpc('get_workout_details', {
      w_id: id, // Pasamos el parámetro esperado
    });

    if (error) {
      console.error('Error fetching workout details:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error fetching workout details:', error);
    return { data: null, error };
  }
};

// Crear un entrenamiento
const useCreateWorkout = async (
  templateId: number,
  duration: number,
  exercises: ExerciseResume[]
) => {
  try {
    // Calculamos el volumen total
    const totalVolume = exercises.reduce((acc, exercise) => {
      const exerciseVolume = exercise.sets!.reduce((setAcc, set) => {
        return setAcc + set.reps * set.weight;
      }, 0);
      return acc + exerciseVolume;
    }, 0);

    // Insertamos el entrenamiento
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({
        template_id: templateId,
        volume: totalVolume,
        duration: duration,
        template: false,
      })
      .select(); // Necesitamos los datos del workout creado

    if (workoutError) {
      console.error('Error inserting workout:', workoutError.message);
      return { error: workoutError };
    }

    const workoutId = workoutData[0].id;

    // Insertamos los ejercicios del entrenamiento
    for (const exercise of exercises) {
      if (exercise.sets && exercise.sets.length > 0) {
        for (const set of exercise.sets) {
          if (set.reps !== 0) {
            const { error: exerciseError } = await supabase
              .from('workout_exercises')
              .insert({
                workout_id: workoutId,
                exercise_id: exercise.id,
                sets: 1,
                reps: set.reps,
                weight: set.weight,
                notes: exercise.notes,
                rest_time: exercise.restTime === '0' ? null : exercise.restTime,
              });

            if (exerciseError) {
              console.error(
                'Error inserting workout exercise set:',
                exerciseError.message
              );
              return { error: exerciseError };
            }
          }
        }
      } else {
        const { error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_id: workoutId,
            exercise_id: exercise.id,
            notes: exercise.notes,
            rest_time: exercise.restTime,
          });

        if (exerciseError) {
          console.error(
            'Error inserting workout exercise without sets:',
            exerciseError.message
          );
          return { error: exerciseError };
        }
      }
    }

    return { error: null };
  } catch (error: unknown) {
    console.error('Unexpected error creating workout:', error);
    return { error };
  }
};

// Obtener los datos de rutina
const useFetchRoutineWorkouts = async (id: number) => {
  try {
    const { data, error } = await supabase.rpc('get_routine_chart_data', {
      templ_id: id, // Pasamos el parámetro esperado
    });

    if (error) {
      console.error('Error fetching routine chart data:', error.message);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: unknown) {
    console.error('Unexpected error fetching routine chart data:', error);
    return { data: null, error };
  }
};

export {
  useFetchDetailsLastWorkout,
  useFetchDetailsWorkout,
  useCreateWorkout,
  useFetchRoutineWorkouts,
};
