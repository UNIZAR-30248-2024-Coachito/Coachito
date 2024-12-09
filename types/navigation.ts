import { ExerciseResume } from '@/components/routine/ExercisesRoutineResume';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Routine: undefined;
  DetailsRoutine: {
    templateId: number;
    myRoutineName: string;
    textColor: string;
    backgrounColor: string;
    blueColor: string;
    exerciseColor: string;
    buttonColor: string;
    redColor: string;
    backgroundColorPopUp: string;
  };
  Profile: { userId: number };
  AddExercise: {
    selectedExercises: ExerciseResume[];
    groupId: number;
    textColor: string;
    backgroundColor: string;
    blueColor: string;
  };
  AddExerciseEdit: {
    selectedExercises: ExerciseResume[];
    routineId: number;
    routineName: string;
  };
  AddRoutine: {
    exercises: ExerciseResume[];
    groupId: number;
  };
  ExerciseResume: undefined;
  EditRoutine: {
    routineId: number;
    routineName: string;
    backgroundColorPopUp: string;
    backgroundColor: string;
    textColor: string;
  };
  StartWorkout: {
    routineId: number;
    routineName: string;
    textColor: string;
    backgroundColor: string;
    backgrounColorPopUp: string;
    redColor: string;
    blueColor: string;
  };
  DetailsWorkout: {
    workoutId: number;
    textColor: string;
    backgroundColor: string;
    backgroundColorEntrenamiento: string;
  };
  DetailsExercise: { exerciseId: number };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
