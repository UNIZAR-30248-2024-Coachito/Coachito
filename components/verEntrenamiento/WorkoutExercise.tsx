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

export interface WorkoutExercise {
  exerciseName: string;
  exerciseThumbnailUrl: string;
  series: number;
}

export interface WorkoutExercises {
  header: WorkoutHeaderResume;
  exercises: WorkoutExercise[];
}

export interface WorkoutHeaderResume {
  workoutName: string;
  workoutDate: Date;
  workoutTime: number;
  workoutVolume: number;
  workoutSeries: number;
}

const WorkoutExercisesComponent: React.FC<WorkoutExercises> = ({
  header,
  exercises,
}) => {
  return (
    <Box>
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
          {exercises.map((exercise, index) => (
            <Box key={index}>
              <HStack className="items-center gap-4">
                <Avatar>
                  <AvatarFallbackText>
                    {exercise.exerciseName}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={{
                      uri: exercise.exerciseThumbnailUrl,
                    }}
                  />
                </Avatar>
                <Text className="flex-1 text-blue-500 font-bold">
                  {exercise.exerciseName}
                </Text>
              </HStack>
              <VStack className="mt-2">
                <HStack className="mb-2">
                  <Text className="w-12 text-center text-gray-400 text-xs">
                    SERIE
                  </Text>
                  <Text className="text-gray-400 ml-2 text-xs">
                    PESO Y REPES
                  </Text>
                </HStack>
                {/* Simulamos información de cada serie */}
                {Array.from({ length: exercise.series }).map(
                  (_, seriesIndex) => (
                    <HStack key={seriesIndex} className="items-center mb-2">
                      <Text className="w-12 text-center text-white font-bold">
                        {seriesIndex + 1}
                      </Text>
                      <Text className="text-white ml-2">
                        10 repeticiones a 50 kg
                      </Text>
                    </HStack>
                  )
                )}
              </VStack>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default WorkoutExercisesComponent;
