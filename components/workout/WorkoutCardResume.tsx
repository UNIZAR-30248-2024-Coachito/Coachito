import React from 'react';
import { Pressable } from 'react-native';
import WorkoutExercisesResumeComponent, {
  WorkoutExercisesResume,
} from './WorkoutExerciseResume';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from './WorkoutHeaderResume';

export interface WorkoutCardResume {
  workout_header_resume: WorkoutHeaderResume;
  workout_exercises_resume: WorkoutExercisesResume;
  onPress?: () => void;
}

const WorkoutCardResumeComponent: React.FC<WorkoutCardResume> = ({
  workout_header_resume: workoutHeaderResume,
  workout_exercises_resume: workoutExercisesResume,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} className="bg-zinc-900 p-4 mb-4 rounded-lg">
      <WorkoutHeaderResumeComponent
        workoutId={workoutHeaderResume.workoutId}
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
