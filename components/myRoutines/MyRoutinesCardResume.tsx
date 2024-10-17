import React, { useState } from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import '../../styles.css';
import { Button } from '../ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useDeleteWorkoutTemplate } from '@/hooks/workoutTemplateHook';
import SlideUpBaseModal from '../shared/SlideUpBaseModal';
import PopupBaseModal from '../shared/PopupBaseModal';

export interface MyRoutinesCardResume {
  templateId: number;
  myRoutineName: string;
  myRoutineExercises: string;
}

export interface MyRoutineCardResumeProps {
  routineCardResume: MyRoutinesCardResume;
  refetchMethod: () => Promise<void>;
}

const MyRoutinesCardResumeComponent: React.FC<MyRoutineCardResumeProps> = ({
  routineCardResume,
  refetchMethod,
}) => {
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const deleteRoutine = async () => {
    const { error } = await useDeleteWorkoutTemplate(
      routineCardResume.templateId
    );

    if (!error) {
      refetchMethod();
    }
  };

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="1"
      className="bg-transparent gap-2"
      //onPress={() => navigation.navigate('EditRoutine')}
    >
      <Pencil color="white" />
      <Text className="text-white">Editar Rutina</Text>
    </Button>,
    <Button
      key="2"
      className="bg-transparent gap-2"
      onPress={() => {
        setIsDeleteModalVisible(true);
        setIsSlideUpModalVisible(false);
      }}
    >
      <Trash color="red" />
      <Text className="text-red-600">Eliminar Rutina</Text>
    </Button>,
  ];

  const componentsPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere eliminar la rutina?
    </Text>,
    <Button
      key="2"
      className="bg-red-800 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        deleteRoutine();
      }}
    >
      <Text className="text-white">Eliminar rutina</Text>
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
    <Pressable className="bg-zinc-900 p-4 mb-4 rounded-lg">
      <Box className="flex-row justify-between items-center">
        <Text className="text-xl font-bold mb-2 text-white">
          {routineCardResume.myRoutineName}
        </Text>

        <Button
          className="bg-transparent"
          onPress={() => {
            setIsSlideUpModalVisible(true);
          }}
        >
          <MoreHorizontal color="white" />
        </Button>
      </Box>

      <Text className="text-gray-400 mb-4">
        {routineCardResume.myRoutineExercises}
      </Text>

      <Button
        className="bg-blue-500 rounded-lg"
        //onPress={() => navigation.navigate('StartRoutine')}
      >
        <Text className="text-white">Empezar Rutina</Text>
      </Button>

      <SlideUpBaseModal
        buttons={buttonsSlideUpModal}
        title={routineCardResume.myRoutineName}
        isVisible={isSlideUpModalVisible}
        setIsModalVisible={setIsSlideUpModalVisible}
      />

      <PopupBaseModal
        components={componentsPopUpModal}
        isVisible={isDeleteModalVisible}
        setIsModalVisible={setIsDeleteModalVisible}
      />
    </Pressable>
  );
};

export default MyRoutinesCardResumeComponent;