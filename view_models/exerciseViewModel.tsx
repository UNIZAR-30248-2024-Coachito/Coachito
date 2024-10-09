export interface ExerciseWorkoutsResume {
  name: string;
  primary_muscle: string;
  secondary_muscles: string[];
  heaviestWeight: number;
  oneRepMax:number;
  bestSetVolume: number;
  bestTotalVolume: number;
  distance: number;
  bestTime: string;
  bestSets: SetsResume[];
}

export interface SetsResume {
  reps: number;
  weight: number;
}
  