import React from 'react';
//import { ScrollView } from 'react-native';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import '../../styles.css';
import { Avatar, AvatarFallbackText, AvatarImage } from '../ui/avatar';
import WorkoutHeaderComponent from './WorkoutHeader';
import WorkoutDivisionComponent from './WorkoutDivision';
import { ExerciseResume } from '../detailsRoutine/ExerciseResume';

export interface WorkoutExercise {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  series: number;
}

export interface WorkoutExercises {
  datos: ExerciseResume[];
  header: WorkoutHeaderResume;
}

export interface WorkoutHeaderResume {
  workoutName: string;
  workoutDate: Date;
  workoutTime: number;
  workoutVolume: number;
  workoutSeries: number;
}

const WorkoutExercisesComponent: React.FC<WorkoutExercises> = ({
  datos,
  header,
}) => {
  return (
    <VStack className="gap-y-4">
      <WorkoutHeaderComponent
        workoutName={header.workoutName}
        workoutTime={header.workoutTime}
        workoutVolume={header.workoutVolume}
        workoutSeries={header.workoutSeries}
      />
      <Text className="text-l mb-2 text-gray-400">División muscular</Text>
      <WorkoutDivisionComponent pecho={7} espalda={2} pierna={1} />
      <Text className="text-l mb-2 text-gray-400">Ejercicios</Text>

      <VStack className="gap-y-4">
        {datos.map((exercise, index) => (
          <Box key={index}>
            <HStack className="items-center gap-4">
              <Avatar>
                <AvatarFallbackText>{exercise.name}</AvatarFallbackText>
                <AvatarImage
                  source={{
                    uri: exercise.thumbnailUrl,
                  }}
                />
              </Avatar>
              <Text className="flex-1 text-blue-500 font-bold">
                {exercise.name}
              </Text>
            </HStack>
            <VStack className="mt-2">
              <HStack className="mb-2">
                <Text className="w-12 text-center text-gray-400 text-xs">
                  SERIE
                </Text>
                <Text className="text-gray-400 ml-2 text-xs">PESO Y REPES</Text>
              </HStack>
              {/* Simulamos información de cada serie */}
              {exercise.series.map((serie, seriesIndex) => (
                <HStack key={seriesIndex} className="items-center mb-2">
                  <Text className="w-12 text-center text-white font-bold">
                    {serie.serie}
                  </Text>
                  <Text className="text-white ml-2">
                    {serie.reps} repeticiones a {serie.weight} kg
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
};

export default WorkoutExercisesComponent;
