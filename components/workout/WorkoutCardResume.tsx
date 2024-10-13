import React from 'react';
import '../../styles.css';
import { Pressable } from 'react-native';
import WorkoutExercisesResumeComponent, {
  WorkoutExercisesResume,
} from './WorkoutExerciseResume';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from './WorkoutHeaderResume';

export interface WorkoutCardResume {
  workoutHeaderResume: WorkoutHeaderResume;
  workoutExercisesResume: WorkoutExercisesResume;
  showHeader: boolean; //Para mostrar/ocultar el encabezado
}

const WorkoutCardResumeComponent: React.FC<WorkoutCardResume> = ({
  workoutHeaderResume,
  workoutExercisesResume,
  showHeader,
}) => {
  return (
    <Pressable className="bg-zinc-900 p-4 mb-4 rounded-lg">
      {/*Solo muestra el encabezado si showHeader es true */}
      {showHeader && (
        <WorkoutHeaderResumeComponent
          workoutName={workoutHeaderResume.workoutName}
          workoutDate={workoutHeaderResume.workoutDate}
          workoutTime={workoutHeaderResume.workoutTime}
          workoutVolume={workoutHeaderResume.workoutVolume}
          workoutSeries={workoutHeaderResume.workoutSeries}
        />
      )}
      <WorkoutExercisesResumeComponent
        exercises={workoutExercisesResume.exercises}
      />
    </Pressable>
  );
};

export default WorkoutCardResumeComponent;
