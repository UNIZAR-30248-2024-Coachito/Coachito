import React from 'react';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Modal, TouchableOpacity } from 'react-native';
import { Box } from '../ui/box';

interface ConfirmDeleteModalProps {
  isVisible: boolean;
  setIsDeleteModal: (newState: boolean) => void;
  onDelete: () => void;
}
const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isVisible,
  setIsDeleteModal,
  onDelete,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setIsDeleteModal(false);
      }}
    >
      <TouchableOpacity
        className="flex-1 bg-black/75 justify-center items-center"
        onPress={() => {
          setIsDeleteModal(false);
        }}
        activeOpacity={1}
      >
        <Box className="bg-zinc-800 rounded-lg items-center p-4 mx-8 self-center">
          <Text className="text-xl font-bold text-center text-white pb-8">
            ¿Está seguro de que quiere eliminarlo?
          </Text>
          <Button
            className="bg-zinc-700 rounded-lg mb-4"
            onPress={() => {
              setIsDeleteModal(false);
              onDelete();
            }}
          >
            <Text className="text-red-600">Eliminar</Text>
          </Button>
          <Button
            className="bg-zinc-700 rounded-lg"
            onPress={() => {
              setIsDeleteModal(false);
            }}
          >
            <Text className="text-white">Cancelar</Text>
          </Button>
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

export default ConfirmDeleteModal;
