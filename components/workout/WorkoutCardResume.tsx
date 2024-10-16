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
  onPress?: () => void;
}

const WorkoutCardResumeComponent: React.FC<WorkoutCardResume> = ({
  workoutHeaderResume,
  workoutExercisesResume,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} className="bg-zinc-900 p-4 mb-4 rounded-lg">
      <WorkoutHeaderResumeComponent
        workoutName={workoutHeaderResume.workoutName}
        workoutDate={workoutHeaderResume.workoutDate}
        workoutTime={workoutHeaderResume.workoutTime}
        workoutVolume={workoutHeaderResume.workoutVolume}
        workoutSeries={workoutHeaderResume.workoutSeries}
      />
      <WorkoutExercisesResumeComponent
        exercises={workoutExercisesResume.exercises}
      />
    </Pressable>
  );
};

export default WorkoutCardResumeComponent;
