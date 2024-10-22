import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutHeaderResume } from '@/components/workout/WorkoutHeaderResume';

export type RootStackParamList = {
  Dashboard: undefined;
  Routine: undefined;
  DetailsRoutine: { templateId: number; myRoutineName: string };
  Profile: undefined;
  Exercises: undefined;
  AddExercise: undefined;
  AddRoutine: undefined;
  VerEntrenamiento: { header: WorkoutHeaderResume; templateId: number };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
