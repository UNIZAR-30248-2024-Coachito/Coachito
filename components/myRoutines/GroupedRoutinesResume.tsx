import React, { useState } from 'react';
import '../../styles.css';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import {
  ArrowDownUp,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash,
} from 'lucide-react-native';
import MyRoutinesCardResumeComponent, {
  MyRoutinesCardResume,
} from './MyRoutinesCardResume';
import { VStack } from '../ui/vstack';
import { useDeleteTemplateWorkoutGroupById } from '@/hooks/workoutTemplateGroupHook';
import { HStack } from '../ui/hstack';
import SlideUpBaseModal from '../shared/SlideUpBaseModal';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import PopupBaseModal from '../shared/PopupBaseModal';

export interface GroupedRoutines {
  groupId: number;
  groupName: string;
  routines: MyRoutinesCardResume[];
}

const GroupedRoutinesResumeComponent: React.FC<GroupedRoutines> = ({
  groupId,
  groupName,
  routines,
}) => {
  const navigation = useNavigation<NavigationProps>();
  const [showRoutines, setShowRoutines] = useState(true);
  const [isSlideUpModalVisible, setIsSlideUpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { execute: deleteTemplateWorkoutGroupById } =
    useDeleteTemplateWorkoutGroupById(groupId);

  const handleDelete = async () => {
    await deleteTemplateWorkoutGroupById();
  };

  const buttonsSlideUpModal: React.ReactNode[] = [
    <Button
      key="1"
      className="bg-transparent"
      //onPress={() => navigation.navigate('ReordenarCarpeta')}
    >
      <ArrowDownUp color="white" />
      <Text className="text-white ml-4">Reordenar Carpetas</Text>
    </Button>,
    <Button
      key="2"
      className="bg-transparent mt-4"
      //onPress={() => navigation.navigate('RenombrarCarpeta')}
    >
      <Pencil color="white" />
      <Text className="text-white ml-4">Renombrar Carpetas</Text>
    </Button>,
    <Button
      key="3"
      className="bg-transparent mt-4"
      onPress={() => navigation.navigate('AddRoutine')}
    >
      <Plus color="white" />
      <Text className="text-white ml-4">Agregar nueva rutina</Text>
    </Button>,
    <Button
      key="4"
      className="bg-transparent mt-4"
      onPress={() => {
        setIsDeleteModalVisible(true);
        setIsSlideUpModalVisible(false);
      }}
    >
      <Trash color="red" />
      <Text className="text-red-600 ml-4">Eliminar Carpeta</Text>
    </Button>,
  ];

  const componentsPopUpModal: React.ReactNode[] = [
    <Text key="1" className="text-xl font-bold text-center text-white pb-8">
      ¿Está seguro de que quiere eliminar la carpeta?
    </Text>,
    <Button
      key="2"
      className="bg-zinc-700 rounded-lg mb-4"
      onPress={() => {
        setIsDeleteModalVisible(false);
        handleDelete();
      }}
    >
      <Text className="text-red-600">Eliminar carpeta</Text>
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
    <VStack>
      <HStack className="justify-between">
        <Button
          className="bg-transparent justify-start"
          onPress={() => {
            setShowRoutines(!showRoutines);
          }}
        >
          {showRoutines ? (
            <ChevronDown color="gray" />
          ) : (
            <ChevronRight color="gray" />
          )}
          <Text className="text-gray-400 ml-2">
            {groupName} ({routines?.length || 0})
          </Text>
        </Button>

        {groupName !== 'Mis Rutinas' && (
          <Button
            className="bg-transparent"
            onPress={() => {
              setIsSlideUpModalVisible(true);
            }}
          >
            <MoreHorizontal color="white" />
          </Button>
        )}
      </HStack>

      {showRoutines &&
        routines!.map((routine, index) => (
          <MyRoutinesCardResumeComponent key={index} {...routine} />
        ))}

      <SlideUpBaseModal
        buttons={buttonsSlideUpModal}
        title={groupName}
        isVisible={isSlideUpModalVisible}
        setIsModalVisible={setIsSlideUpModalVisible}
      />

      <PopupBaseModal
        components={componentsPopUpModal}
        isVisible={isDeleteModalVisible}
        setIsModalVisible={setIsDeleteModalVisible}
      />
    </VStack>
  );
};

export default GroupedRoutinesResumeComponent;
