import React from 'react'
import { Pressable, ScrollView } from 'react-native'
import { Home, Dumbbell, User, Search, Bell, ChevronDown, Star, ThumbsUp, MessageCircle, Share2, Award } from 'lucide-react-native'
import { Avatar } from '../components/ui/avatar';
import { Box } from '../components/ui/box';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';

interface Exercise {
  name: string;
  icon: string;
}

interface User {
  name: string;
  avatar: string;
  lastActive: string;
}

interface Workout {
  user: User;
  workoutName: string;
  time: string;
  volume: string;
  records: number;
  exercises: Exercise[];
}

const WorkoutCard: React.FC<Workout> = ({ user, workoutName, time, volume, records, exercises }) => (
  <Box className="bg-zinc-900 p-4 mb-4 rounded-lg">
    <HStack className="items-center mb-2 space-x-2">
      <VStack>
        <Text className="text-xl font-bold mb-2 text-white">{workoutName}</Text>
        <Text className="text-xs text-gray-400">{user.lastActive}</Text>
      </VStack>
    </HStack>
    <HStack className="justify-between mb-4">
      <VStack>
        <Text className="text-gray-400">Tiempo</Text>
        <Text className="text-white">{time}</Text>
      </VStack>
      <VStack>
        <Text className="text-gray-400">Volumen</Text>
        <Text className="text-white">{volume}</Text>
      </VStack>
      <VStack>
        <Text className="text-gray-400">Récords</Text>
        <HStack className="items-center">
          <Text className="text-white">{records}</Text>
          <Award fill="yellow" />
        </HStack>
      </VStack>
    </HStack>
    <Text className="font-semibold mb-2 text-white">Entrenamiento</Text>
    <VStack className="space-y-2">
      {exercises.map((exercise, index) => (
        <HStack key={index} className="items-center space-x-2">
          <Text className="flex-1 text-white">{exercise.name}</Text>
        </HStack>
      ))}
    </VStack>
    <Text className="mt-2 text-gray-400 text-center">Ver {exercises.length - 3} más ejercicios</Text>
  </Box>
)

const Dashboard: React.FC = () => {
  const workouts: Workout[] = [
    {
      user: { name: 'mikegf', avatar: 'https://example.com/avatar1.jpg', lastActive: 'hace 4 días' },
      workoutName: 'FULL BODY #3',
      time: '1h 50min',
      volume: '3,024.5 kg',
      records: 2,
      exercises: [
        { name: '3 series Press de Banca Inclinado (Mancuerna)', icon: 'https://example.com/exercise1.png' },
        { name: '3 series Pulldown Lateral con Agarre Inverso (Cable)', icon: 'https://example.com/exercise2.png' },
        { name: '3 series Empuje de Caderas (Barra)', icon: 'https://example.com/exercise3.png' },
      ],
    },
    {
      user: { name: 'lilainaranjo', avatar: 'https://example.com/avatar2.jpg', lastActive: 'hace 4 días' },
      workoutName: 'Full Body C',
      time: '1h 1min',
      volume: '4,410 kg',
      records: 9,
      exercises: [
        { name: '3 series Press de Banca Inclinado (Mancuerna)', icon: 'https://example.com/exercise1.png' },
        { name: '3 series Sentadillas con Barra', icon: 'https://example.com/exercise4.png' },
        { name: '3 series Remo con Barra', icon: 'https://example.com/exercise5.png' },
      ],
    },
    {
      user: { name: 'lilainaranjo', avatar: 'https://example.com/avatar2.jpg', lastActive: 'hace 4 días' },
      workoutName: 'Full Body C',
      time: '1h 1min',
      volume: '4,410 kg',
      records: 9,
      exercises: [
        { name: '3 series Press de Banca Inclinado (Mancuerna)', icon: 'https://example.com/exercise1.png' },
        { name: '3 series Sentadillas con Barra', icon: 'https://example.com/exercise4.png' },
        { name: '3 series Remo con Barra', icon: 'https://example.com/exercise5.png' },
      ],
    },
  ]

  return (
    <Box className="flex-1">
      <ScrollView>
        <VStack className="p-4">
          {workouts.map((workout, index) => (
            <WorkoutCard key={index} {...workout} />
          ))}
        </VStack>
      </ScrollView>
      <Box className="absolute bottom-0 left-0 right-0 bg-zinc-950 py-4">
        <HStack className="justify-around">
          <Pressable>
            <VStack className="items-center">
              <Home color="blue" />
              <Text className="text-xs text-blue-500">Inicio</Text>
            </VStack>
          </Pressable>
          <Pressable>
            <VStack className="items-center">
              <Dumbbell color="white" className="w-5 h-5 text-gray-400" />
              <Text className="text-xs text-gray-400">Entrenamiento</Text>
            </VStack>
          </Pressable>
          <Pressable>
            <VStack className="items-center">
              <User color="white" className="w-5 h-5 text-gray-400" />
              <Text className="text-xs text-gray-400">Perfil</Text>
            </VStack>
          </Pressable>
        </HStack>
      </Box>
    </Box>
  )
}

export default Dashboard