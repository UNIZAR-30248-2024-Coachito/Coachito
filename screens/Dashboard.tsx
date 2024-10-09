import React from 'react'
import { Pressable, ScrollView } from 'react-native'
import { Home, Dumbbell, User, Award } from 'lucide-react-native'
import { Box } from '../components/ui/box';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import '../styles.css';
import { useFetchDashboardWorkouts } from '../hooks/dashboardHook';
import { WorkoutResume } from '@/view_models/dashboardViewModel';

const WorkoutCard: React.FC<WorkoutResume> = ({ name, created_at, time, volumen, exercises }) => (
  <Box className="bg-zinc-900 p-4 mb-4 rounded-lg">
    <HStack className="items-center mb-2 space-x-2">
      <VStack>
        <Text className="text-xl font-bold mb-2 text-white">{name}</Text>
        <Text className="text-xs text-gray-400">{created_at}</Text>
      </VStack>
    </HStack>
    <HStack className="justify-between mb-4">
      <VStack>
        <Text className="text-gray-400">Tiempo</Text>
        <Text className="text-white">{time}</Text>
      </VStack>
      <VStack>
        <Text className="text-gray-400">Volumen</Text>
        <Text className="text-white">{volumen}</Text>
      </VStack>
      <VStack>
        <Text className="text-gray-400">Récords</Text>
        <HStack className="items-center">
          <Text className="text-white">{5}</Text>
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
  const { workoutResumes: dashboardData, loading, error } = useFetchDashboardWorkouts()
  
  return (
    <Box className="flex-1">
      <ScrollView>
        <VStack className="p-4">
          {!loading && !error && dashboardData?.map((workout, index) => (
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
