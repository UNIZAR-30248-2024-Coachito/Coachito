import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { Minus } from 'lucide-react-native';

export interface SlideUpModalProps {
  buttons: React.ReactNode[];
  title: string;
  isVisible: boolean;
  setIsModalVisible: (newState: boolean) => void;
}

const RoutineSlideUpModal: React.FC<SlideUpModalProps> = ({
  buttons,
  title,
  isVisible,
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
            {title}
          </Text>
          <Box className="bottom-0 bg-zinc-800 rounded-lg p-4 w-full">
            {buttons.map((button) => button)}
          </Box>
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

export default RoutineSlideUpModal;
