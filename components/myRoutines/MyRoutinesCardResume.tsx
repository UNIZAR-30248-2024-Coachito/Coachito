import React, { useState } from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import '../../styles.css';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react-native';
import RoutineSlideUpModal from './RoutineSlideUpModal';
import { Pressable } from 'react-native';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useDeleteTemplateWorkoutById } from '@/hooks/templateWorkoutHook';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const handleDelete = async () => {
    await useDeleteTemplateWorkoutById(templateId);
  };

  return (
    <Pressable className="bg-zinc-900 p-4 mb-4 rounded-lg">
      <Box className="flex-row justify-between items-center">
        <Text className="text-xl font-bold mb-2 text-white">
          {myRoutineName}
        </Text>

        <Button
          className="bg-transparent"
          onPress={() => {
            setIsModalVisible(true);
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

      <RoutineSlideUpModal
        isVisible={isModalVisible}
        routineName={myRoutineName}
        setIsDeleteModal={setIsDeleteModal}
        setIsModalVisible={setIsModalVisible}
      />

      <ConfirmDeleteModal
        isVisible={isDeleteModal}
        setIsDeleteModal={setIsDeleteModal}
        onDelete={handleDelete}
      />
    </Pressable>
  );
};

export default MyRoutinesCardResumeComponent;
