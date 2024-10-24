import { ExerciseResume } from '@/components/detailsRoutine/ExerciseResume';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  DetailsRoutine: { templateId: number; myRoutineName: string };
  Profile: undefined;
  Exercises: undefined;
  AddExercise: { selectedExercises: ExerciseResume[]; groupId: number };
  AddExerciseEdit: {
    selectedExercises: ExerciseResume[];
    routineId: number;
    routineName: string;
  };
  AddRoutine: { exercises: ExerciseResume[]; groupId: number };
  ExerciseResume: undefined;
  EditRoutine: {
    routineId: number;
    routineName: string;
    exercises: ExerciseResume[];
  };
  StartWorkout: {
    routineId: number;
    routineName: string;
  };
  VerEntrenamiento: { workoutId: number };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
