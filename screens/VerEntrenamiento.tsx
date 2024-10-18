import React from 'react';
import { Text } from '../components/ui/text';
import { HStack } from '../components/ui/hstack';
import { Box } from '../components/ui/box';
import { VStack } from '../components/ui/vstack';
import { Button } from '../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { NavigationProps } from '@/types/navigation';
import WorkoutExercisesComponent from '@/components/verEntrenamiento/WorkoutExercise';
import { Ellipsis, ArrowLeft } from 'lucide-react-native';
import { ScrollView } from 'react-native';

type VerEntrenamientoRouteProp = RouteProp<
  RootStackParamList,
  'VerEntrenamiento'
>;

const VerEntrenamiento: React.FC = () => {
  const route = useRoute<VerEntrenamientoRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const { workout } = route.params;

  return (
    <Box className="flex-1 p-4">
      {/* Contenedor principal */}
      <VStack className="space-y-4">
        {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
        <HStack className="justify-between items-center">
          <Button
            className="bg-black"
            onPress={() => navigation.navigate('Dashboard')}
          >
            <ArrowLeft color="#ffffff" />
          </Button>
          <Text className="text-xl">
            {workout.workoutHeaderResume?.workoutDate instanceof Date
              ? workout.workoutHeaderResume.workoutDate.toLocaleDateString() // Cambiar a cadena
              : 'Fecha no disponible'}
          </Text>
          <Button
            className="bg-black"
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ellipsis color="#ffffff" />
          </Button>
        </HStack>
        <ScrollView>
          {/* Input para el título de la rutina */}
          <Box className="w-full pt-2">
            <WorkoutExercisesComponent
              header={workout.workoutHeaderResume}
              exercises={workout.workoutExercisesResume.exercises}
            />
          </Box>
        </ScrollView>
      </VStack>
    </Box>
  );
};

export default VerEntrenamiento;
