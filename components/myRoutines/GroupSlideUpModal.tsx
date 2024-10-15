import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { Box } from '../ui/box';
import { ArrowDownUp, Minus, Pencil, Plus, Trash } from 'lucide-react-native';
import { NavigationProps } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';

interface SlideUpModalProps {
  groupName: string;
  isVisible: boolean;
  setIsDeleteModal: (newState: boolean) => void;
  setIsModalVisible: (newState: boolean) => void;
}

const GroupSlideUpModal: React.FC<SlideUpModalProps> = ({
  groupName,
  isVisible,
  setIsDeleteModal,
  setIsModalVisible,
}) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <>
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
          <Box className="absolute bottom-0 w-full bg-zinc-900 rounded-t-2xl shadow-lg items-center">
            <Minus color="grey" />
            <Text className="text-xl font-bold text-center text-white pb-8">
              {groupName}
            </Text>
            <Box className="bottom-0 bg-zinc-800 rounded-lg p-4 w-full">
              <Button
                className="bg-transparent"
                //onPress={() => navigation.navigate('ReordenarCarpeta')}
              >
                <ArrowDownUp color="white" />
                <Text className="text-white ml-4">Reordenar Carpetas</Text>
              </Button>
              <Button
                className="bg-transparent mt-4"
                //onPress={() => navigation.navigate('RenombrarCarpeta')}
              >
                <Pencil color="white" />
                <Text className="text-white ml-4">Renombrar Carpetas</Text>
              </Button>
              <Button
                className="bg-transparent mt-4"
                onPress={() => navigation.navigate('AddRoutine')}
              >
                <Plus color="white" />
                <Text className="text-white ml-4">Agregar nueva rutina</Text>
              </Button>
              <Button
                className="bg-transparent mt-4"
                onPress={() => {
                  setIsDeleteModal(true);
                  setIsModalVisible(false);
                }}
              >
                <Trash color="red" />
                <Text className="text-red-600 ml-4">Eliminar Carpeta</Text>
              </Button>
            </Box>
          </Box>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default GroupSlideUpModal;
