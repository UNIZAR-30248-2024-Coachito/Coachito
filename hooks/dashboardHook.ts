import { supabase } from '@/api/supabaseClient';
import useCRUD from './useCRUD';
import { WorkoutRepository } from '@/repositories/workoutRepository';
import { WorkoutResume } from '@/view_models/dashboardViewModel';

const workoutRepository = new WorkoutRepository(supabase);

const useFetchDashboardWorkouts = () => {
  const {data: workouts, loading, error} = useCRUD(() => workoutRepository.getDashboardData());

  if (!loading && !error) {
    const workoutResumes: WorkoutResume[] = workouts!.map(workout => ({
      name: workout.workout_templates.name,
      created_at: workout.created_at,
      time: workout.duration,
      volumen: workout.volume,
      exercises: workout.workout_exercises.map((exercise: { sets: any; exercises: { name: any; }; }) => ({
        sets: exercise.sets,
        name: exercise.exercises.name,
      })),
    }));

    console.log(workouts);
    
    return {workoutResumes, loading, error}
  }

  return {workouts, loading, error}
}

export {
  useFetchDashboardWorkouts,
};
