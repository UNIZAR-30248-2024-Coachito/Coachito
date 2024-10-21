import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Box } from '../ui/box';

interface PopupBaseModalProps {
  components: React.ReactNode[];
  isVisible: boolean;
  setIsModalVisible: (newState: boolean) => void;
}

const PopupBaseModal: React.FC<PopupBaseModalProps> = ({
  components,
  isVisible,
  setIsModalVisible,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      onRequestClose={() => {
        setIsModalVisible(false);
      }}
    >
      <TouchableOpacity
        className="flex-1 bg-black/75 justify-center items-center"
        onPress={() => {
          setIsModalVisible(false);
        }}
        activeOpacity={1}
      >
        <Box className="bg-zinc-800 rounded-lg items-center p-4 mx-8 self-center">
          {components.map((component) => component)}
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

export default PopupBaseModal;
