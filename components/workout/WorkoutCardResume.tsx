import React from 'react';
import { Pressable } from 'react-native';
import WorkoutExercisesResumeComponent, {
  WorkoutExercisesResume,
} from './WorkoutExerciseResume';
import WorkoutHeaderResumeComponent, {
  WorkoutHeaderResume,
} from './WorkoutHeaderResume';

export interface WorkoutCardResume {
  backgroundColor: string;
  textColor: string;
  workout_header_resume: WorkoutHeaderResume;
  workout_exercises_resume: WorkoutExercisesResume;
  onPress?: () => void;
}

const WorkoutCardResumeComponent: React.FC<WorkoutCardResume> = ({
  backgroundColor,
  textColor,
  workout_header_resume: workoutHeaderResume,
  workout_exercises_resume: workoutExercisesResume,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor }}
      className="p-4 mb-4 rounded-lg"
    >
      <WorkoutHeaderResumeComponent
        textColor={textColor}
        backgroundColor={backgroundColor}
        workoutId={workoutHeaderResume.workoutId}
        workoutName={workoutHeaderResume.workoutName}
        workoutDate={workoutHeaderResume.workoutDate}
        workoutTime={workoutHeaderResume.workoutTime}
        workoutVolume={workoutHeaderResume.workoutVolume}
        workoutSeries={workoutHeaderResume.workoutSeries}
      />
      <WorkoutExercisesResumeComponent
        textColor={textColor}
        exercises={workoutExercisesResume.exercises}
      />
    </Pressable>
  );
};

export default WorkoutCardResumeComponent;
