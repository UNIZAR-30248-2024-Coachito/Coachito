export interface DashboardViewModel {
  workouts: WorkoutResume[];
}

export interface WorkoutResume {
  name: string;
  created_at: string;
  time: string;
  volumen: number;
  exercises: ExerciseResume[];
}

export interface ExerciseResume {
  sets: number;
  name: string;
}
