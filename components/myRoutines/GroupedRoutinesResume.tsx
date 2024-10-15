import React, { useState } from 'react';
import '../../styles.css';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import MyRoutinesCardResumeComponent, {
  MyRoutinesCardResume,
} from './MyRoutinesCardResume';
import { VStack } from '../ui/vstack';
import GroupSlideUpModal from './GroupSlideUpModal';
import { useDeleteTemplateWorkoutGroupById } from '@/hooks/templateWorkoutHook';
import { HStack } from '../ui/hstack';
import ConfirmDeleteModal from './ConfirmDeleteModal';

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
  const [showRoutines, setShowRoutines] = useState(true);
  const [isGroupSlideUpModalVisible, setIsGroupSlideUpModalVisible] =
    useState(false);
  const [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false);

  const { execute: deleteTemplateWorkoutGroupById } =
    useDeleteTemplateWorkoutGroupById(groupId);

  const handleDelete = async () => {
    await deleteTemplateWorkoutGroupById();
  };

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
              setIsGroupSlideUpModalVisible(true);
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

      <GroupSlideUpModal
        groupName={groupName}
        isVisible={isGroupSlideUpModalVisible}
        setIsDeleteModal={setIsVisibleDeleteModal}
        setIsModalVisible={setIsGroupSlideUpModalVisible}
      />

      <ConfirmDeleteModal
        isVisible={isVisibleDeleteModal}
        setIsDeleteModal={setIsVisibleDeleteModal}
        onDelete={handleDelete}
      />
    </VStack>
  );
};

export default GroupedRoutinesResumeComponent;
