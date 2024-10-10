import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '../components/ui/box';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import '../styles.css';
import WorkoutHeaderResumeComponent from '@/components/workout/WorkoutHeaderResume';

interface Exercise {
  name: string;
  icon: string;
}

interface Workout {
  workoutDate: Date;
  workoutName: string;
  time: number;
  volume: number;
  exercises: Exercise[];
}

const WorkoutCard: React.FC<Workout> = ({
  workoutDate,
  workoutName,
  time,
  volume,
  exercises,
}) => (
  <Box className="bg-zinc-900 p-4 mb-4 rounded-lg">
    <WorkoutHeaderResumeComponent
      workoutName={workoutName}
      workoutDate={workoutDate}
      workoutTime={time}
      workoutVolume={volume}
    />
    <Text className="font-semibold mb-2 text-white">Entrenamiento</Text>
    <VStack className="space-y-2">
      {exercises.map((exercise, index) => (
        <HStack key={index} className="items-center space-x-2">
          <Text className="flex-1 text-white">{exercise.name}</Text>
        </HStack>
      ))}
    </VStack>
    <Text className="mt-2 text-gray-400 text-center">
      Ver {exercises.length - 3} más ejercicios
    </Text>
  </Box>
);

const Dashboard: React.FC = () => {
  const workouts: Workout[] = [
    {
      workoutDate: new Date('2024-10-07T00:00:00'),
      workoutName: 'FULL BODY #3',
      time: 110,
      volume: 3024.5,
      exercises: [
        {
          name: '3 series Press de Banca Inclinado (Mancuerna)',
          icon: 'https://example.com/exercise1.png',
        },
        {
          name: '3 series Pulldown Lateral con Agarre Inverso (Cable)',
          icon: 'https://example.com/exercise2.png',
        },
        {
          name: '3 series Empuje de Caderas (Barra)',
          icon: 'https://example.com/exercise3.png',
        },
      ],
    },
    {
      workoutDate: new Date('2024-10-04T00:00:00'),
      workoutName: 'Full Body C',
      time: 61,
      volume: 4410,
      exercises: [
        {
          name: '3 series Press de Banca Inclinado (Mancuerna)',
          icon: 'https://example.com/exercise1.png',
        },
        {
          name: '3 series Sentadillas con Barra',
          icon: 'https://example.com/exercise4.png',
        },
        {
          name: '3 series Remo con Barra',
          icon: 'https://example.com/exercise5.png',
        },
      ],
    },
    {
      workoutDate: new Date('2024-10-01T00:00:00'),
      workoutName: 'Full Body C',
      time: 61,
      volume: 4410,
      exercises: [
        {
          name: '3 series Press de Banca Inclinado (Mancuerna)',
          icon: 'https://example.com/exercise1.png',
        },
        {
          name: '3 series Sentadillas con Barra',
          icon: 'https://example.com/exercise4.png',
        },
        {
          name: '3 series Remo con Barra',
          icon: 'https://example.com/exercise5.png',
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1">
      <VStack className="p-4">
        {workouts.map((workout, index) => (
          <WorkoutCard key={index} {...workout} />
        ))}
      </VStack>
    </ScrollView>
  );
};

export default Dashboard;
