import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Box } from '../ui/box';

interface PopupBaseModalProps {
  backgroundColor: string;
  components: React.ReactNode[];
  isVisible: boolean;
  setIsModalVisible: (newState: boolean) => void;
}

const PopupBaseModal: React.FC<PopupBaseModalProps> = ({
  backgroundColor,
  components,
  isVisible,
  setIsModalVisible,
}) => {
  return (
    <Modal
      testID="modal"
      visible={isVisible}
      transparent={true}
      onRequestClose={() => {
        setIsModalVisible(false);
      }}
    >
      <TouchableOpacity
        testID="modal-touchable"
        className="flex-1 bg-black/25 justify-center items-center"
        onPress={() => {
          setIsModalVisible(false);
        }}
        activeOpacity={1}
      >
        <Box
          testID="modal-content"
          style={{ backgroundColor: backgroundColor }}
          className="rounded-lg items-center p-4 mx-8 self-center"
        >
          {components.map((component) => component)}
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

export default PopupBaseModal;
