import React, { useState } from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import '../../styles.css';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react-native';
import SlideUpModal from './SlideUpModal';
import { Pressable } from 'react-native';

export interface MyRoutinesCardResume {
  myRoutineName: string;
  myRoutineExercises: string;
}

const MyRoutinesCardResumeComponent: React.FC<MyRoutinesCardResume> = ({
  myRoutineName,
  myRoutineExercises,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  return (
    <Pressable className="bg-zinc-900 p-4 mb-4 rounded-lg">
      <Box className="flex-row justify-between items-center">
        <Text className="text-xl font-bold mb-2 text-white">
          {myRoutineName}
        </Text>

        <Button className="bg-transparent" onPress={toggleModal}>
          <MoreHorizontal color="white" />
        </Button>
      </Box>

      <Text className="text-gray-400 mb-4">{myRoutineExercises}</Text>

      <Button
        className="bg-blue-500 rounded-lg"
        //onPress={() => navigation.navigate('StartRoutine')}
      >
        <Text className="text-white">Empezar Rutina</Text>
      </Button>

      <SlideUpModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        routineName={myRoutineName}
      />
    </Pressable>
  );
};

export default MyRoutinesCardResumeComponent;
