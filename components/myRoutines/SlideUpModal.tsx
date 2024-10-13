// SlideUpModal.tsx
import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Box } from '../ui/box';
import { Minus, Pencil, Trash } from 'lucide-react-native';

interface SlideUpModalProps {
  isVisible: boolean;
  onClose: () => void;
  routineName: string;
}

const SlideUpModal: React.FC<SlideUpModalProps> = ({
  isVisible,
  onClose,
  routineName,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 -black bg-opacity-50"
        onPress={onClose}
        activeOpacity={1}
      >
        <Box className="absolute bottom-0 w-full bg-zinc-900 rounded-t-2xl shadow-lg items-center">
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
              //onPress={() => DeleteRoutine}
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

export default SlideUpModal;
