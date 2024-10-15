import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Box } from '../ui/box';
import { Minus, Pencil, Trash } from 'lucide-react-native';

interface SlideUpModalProps {
  routineName: string;
  isVisible: boolean;
  setIsDeleteModal: (newState: boolean) => void;
  setIsModalVisible: (newState: boolean) => void;
}

const RoutineSlideUpModal: React.FC<SlideUpModalProps> = ({
  routineName,
  isVisible,
  setIsDeleteModal,
  setIsModalVisible,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setIsModalVisible(false);
      }}
    >
      <TouchableOpacity
        className="flex-1 bg-black/75"
        onPress={() => {
          setIsModalVisible(false);
        }}
        activeOpacity={1}
      >
        <Box className="absolute bottom-0 w-full bg-zinc-950 rounded-t-2xl shadow-lg items-center">
          <Minus color="grey" />
          <Text className="text-xl font-bold text-center text-white pb-8">
            {routineName}
          </Text>
          <Box className="bottom-0 bg-zinc-800 rounded-lg p-4 w-full">
            <Button
              className="bg-transparent text-white"
              //onPress={() => navigation.navigate('EditRoutine')}
            >
              <Pencil color="white" />
              <Text className="text-white ml-4">Editar Rutina</Text>
            </Button>
            <Button
              className="bg-transparent mt-4"
              onPress={() => {
                setIsDeleteModal(true);
                setIsModalVisible(false);
              }}
            >
              <Trash color="red" />
              <Text className="text-red-600 ml-4">Eliminar Rutina</Text>
            </Button>
          </Box>
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

export default RoutineSlideUpModal;
