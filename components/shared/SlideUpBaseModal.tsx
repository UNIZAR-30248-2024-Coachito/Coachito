import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { Minus } from 'lucide-react-native';
import { Divider } from '../ui/divider';

export interface SlideUpModalProps {
  buttons: React.ReactNode[];
  title: string;
  isVisible: boolean;
  setIsModalVisible: (newState: boolean) => void;
}

const SlideUpBaseModal: React.FC<SlideUpModalProps> = ({
  buttons,
  title,
  isVisible,
  setIsModalVisible,
}) => {
  return (
    <Modal
      testID="modal"
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setIsModalVisible(false);
      }}
    >
      <TouchableOpacity
        testID="modal-touchable"
        className="flex-1 bg-black/75"
        onPress={() => {
          setIsModalVisible(false);
        }}
        activeOpacity={1}
      >
        <Box
          testID="modal-content"
          className="absolute bottom-0 w-full bg-zinc-950 rounded-t-2xl shadow-lg items-center"
        >
          <Minus color="grey" />
          <Text className="text-xl font-bold text-center text-white py-4">
            {title}
          </Text>
          <Box className="bottom-0 bg-zinc-800 rounded-lg p-4 w-full gap-2">
            {buttons.map((button, index) => (
              <React.Fragment key={index}>
                {button}
                {index < buttons.length - 1 ? (
                  <Divider testID="divider" className="my-0.5 bg-zinc-700" />
                ) : (
                  <></>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </TouchableOpacity>
    </Modal>
  );
};

export default SlideUpBaseModal;
