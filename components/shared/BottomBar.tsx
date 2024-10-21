import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Home, Dumbbell, User } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { HStack } from '../ui/hstack';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';
import { NavigationProps } from '@/types/navigation';

export default function BottomBar() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();

  const isDashboardActive = route.name === 'Dashboard';
  const isRoutineActive = route.name === 'Routine';
  const isProfileActive = route.name === 'Profile';

  return (
    <HStack className="justify-around bg-zinc-950 py-4">
      <Pressable onPress={() => navigation.navigate('Dashboard')}>
        <VStack className="items-center">
          <Home
            testID="inicio-icon"
            color={isDashboardActive ? 'rgb(59 130 246)' : 'white'}
          />
          <Text
            className={`text-xs ${isDashboardActive ? 'text-blue-500' : 'text-gray-400'}`}
          >
            Inicio
          </Text>
        </VStack>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Routine')}>
        <VStack className="items-center">
          <Dumbbell
            testID="entrenamiento-icon"
            color={isRoutineActive ? 'rgb(59 130 246)' : 'white'}
          />
          <Text
            className={`text-xs ${isRoutineActive ? 'text-blue-500' : 'text-gray-400'}`}
          >
            Entrenamiento
          </Text>
        </VStack>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Profile')}>
        <VStack className="items-center">
          <User
            testID="perfil-icon"
            color={isProfileActive ? 'rgb(59 130 246)' : 'white'}
          />
          <Text
            className={`text-xs ${isProfileActive ? 'text-blue-500' : 'text-gray-400'}`}
          >
            Perfil
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  );
}
