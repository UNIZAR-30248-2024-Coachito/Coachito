import React, { useState } from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import '../../styles.css';
import { Button } from '../ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useFetchWorkoutTemplateById, useUpdateWorkoutTemplate } from '@/hooks/workoutTemplateHook';
import SlideUpBaseModal from '../shared/SlideUpBaseModal';
import PopupBaseModal from '../shared/PopupBaseModal';

export interface MyRoutinesCardResume {
  templateId: number;
  myRoutineName: string;
  myRoutineExercises: string;
}

const MyRoutinesCardResumeComponent: React.FC<MyRoutinesCardResume> = ({
  templateId,
  myRoutineName,
  myRoutineExercises,
}) => {
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const handleDelete = async () => {
    //const entity = await useFetchWorkoutTemplateById(templateId);
    //entity.data!.deleted = true;
    //await useUpdateWorkoutTemplate(entity.data);
    console.log("Rutina eliminada");
  };

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="1"
      className="bg-transparent text-white"
      //onPress={() => navigation.navigate('EditRoutine')}
    >
      <Pencil color="white" />
      <Text className="text-white ml-4">Editar Rutina</Text>
    </Button>,
    <Button
      key="2"
      className="bg-transparent mt-4"
      onPress={() => {
        setIsDeleteModalVisible(true);
        setIsSlideUpModalVisible(false);
      }}
    >
      <Trash color="red" />
      <Text className="text-red-600 ml-4">Eliminar Rutina</Text>
    </Button>,
  ];

  const componentsPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere eliminar la rutina?
    </Text>,
    <Button
      key="2"
      className="bg-zinc-700 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        handleDelete();
      }}
    >
      <Text className="text-red-600">Eliminar rutina</Text>
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
          {myRoutineName}
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

      <Text className="text-gray-400 mb-4">{myRoutineExercises}</Text>

      <Button
        className="bg-blue-500 rounded-lg"
        //onPress={() => navigation.navigate('StartRoutine')}
      >
        <Text className="text-white">Empezar Rutina</Text>
      </Button>

      <SlideUpBaseModal
        buttons={buttonsSlideUpModal}
        title={myRoutineName}
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
