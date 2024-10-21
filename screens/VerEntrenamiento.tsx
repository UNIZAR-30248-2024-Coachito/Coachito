import React, { useState } from 'react';
import { Text } from '../components/ui/text';
import { Box } from '../components/ui/box';
import { VStack } from '../components/ui/vstack';
import { Button } from '../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { NavigationProps } from '@/types/navigation';
import WorkoutExercisesComponent from '@/components/verEntrenamiento/WorkoutExercise';
import WorkoutBarraSuperiorComponent from '@/components/verEntrenamiento/WorkoutBarraSuperior';
import { ScrollView } from 'react-native';

import { Pencil, Trash } from 'lucide-react-native';
import SlideUpBaseModal from '@/components/shared/SlideUpBaseModal';
import PopupBaseModal from '@/components/shared/PopupBaseModal';

type VerEntrenamientoRouteProp = RouteProp<
  RootStackParamList,
  'VerEntrenamiento'
>;

const VerEntrenamiento: React.FC = () => {
  const route = useRoute<VerEntrenamientoRouteProp>();
  const navigation = useNavigation<NavigationProps>();
  const { workout } = route.params;

  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDelete = async () => {
    //const entity = await useFetchWorkoutTemplateById(templateId);
    //entity.data!.deleted = true;
    //await useUpdateWorkoutTemplate(entity.data);
    console.log('Entrenamiento eliminado');
    navigation.navigate('Dashboard');
  };

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="2"
      className="bg-transparent mt-4"
      onPress={() => navigation.navigate('Dashboard')}
    >
      <Pencil color="white" />
      <Text className="text-white ml-4">Editar entrenamiento</Text>
    </Button>,
    <Button
      key="3"
      className="bg-transparent mt-4"
      onPress={() => {
        setIsDeleteModalVisible(true);
        setIsSlideUpModalVisible(false);
      }}
    >
      <Trash color="red" />
      <Text className="text-red-600 ml-4">Borrar entrenamiento</Text>
    </Button>,
  ];

  const componentsDeleteGroupPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere borrar el entrenamiento?
    </Text>,
    <Button
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        handleDelete();
      }}
    >
      <Text className="text-white">Borrar entrenamiento</Text>
    </Button>,
    <Button
      key="3"
      className="bg-zinc-700 rounded-lg"
      onPress={() => {
        setIsDeleteModalVisible(false);
      }}
    >
      <Text className="text-white">Cancelar</Text>
    </Button>,
  ];

  return (
    <Box className="flex-1 p-4">
      {/* Contenedor principal */}
      <VStack className="space-y-2">
        {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
        <WorkoutBarraSuperiorComponent
          fecha={workout.workoutHeaderResume.workoutDate}
          setIsSlideUpModalVisible={setIsSlideUpModalVisible}
        />
        <SlideUpBaseModal
          buttons={buttonsSlideUpModal}
          title={workout.workoutHeaderResume.workoutName}
          isVisible={isSlideUpModalVisible}
          setIsModalVisible={setIsSlideUpModalVisible}
        />
        <PopupBaseModal
          components={componentsDeleteGroupPopUpModal}
          isVisible={isDeleteModalVisible}
          setIsModalVisible={setIsDeleteModalVisible}
        />
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
