import { ExerciseListResume } from '@/screens/AddExercise';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  DetailsRoutine: { templateId: number; myRoutineName: string };
  Profile: undefined;
  Exercises: undefined;
  AddExercise: { selectedExercises: ExerciseListResume[] };
  AddRoutine: { exercises: ExerciseListResume[] };
  ExerciseResume: undefined;
  EditRoutine: { routineId: number };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
