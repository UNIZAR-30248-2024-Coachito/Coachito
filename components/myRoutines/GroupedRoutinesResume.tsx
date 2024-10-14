import React, { useState } from 'react';
import '../../styles.css';
import { Text } from '../ui/text';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import MyRoutinesCardResumeComponent, {
  MyRoutinesCardResume,
} from './MyRoutinesCardResume';
import { VStack } from '../ui/vstack';

export interface GroupedRoutines {
  groupName: string;
  routines: MyRoutinesCardResume[];
}

const GroupedRoutinesResumeComponent: React.FC<GroupedRoutines> = ({
  groupName,
  routines,
}) => {
  const [showRoutines, setShowRoutines] = useState(true);

  const toggleRoutines = () => {
    setShowRoutines((prev) => !prev);
  };

  return (
    <VStack>
      <Button className="bg-transparent justify-start" onPress={toggleRoutines}>
        {showRoutines ? (
          <ChevronDown color="gray" />
        ) : (
          <ChevronRight color="gray" />
        )}
        <Text className="text-gray-400 ml-2">
          {groupName} ({routines?.length || 0})
        </Text>
      </Button>

      {showRoutines &&
        routines!.map((routine, index) => (
          <MyRoutinesCardResumeComponent key={index} {...routine} />
        ))}
    </VStack>
  );
};

export default GroupedRoutinesResumeComponent;
