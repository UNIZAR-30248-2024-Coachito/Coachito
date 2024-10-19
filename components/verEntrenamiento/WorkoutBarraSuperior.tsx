import React from 'react';
import { Text } from '../ui/text';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { Button } from '../ui/button';
import { Ellipsis, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import '../../styles.css';

export interface WorkoutSuperior {
  fecha: Date;
  setIsSlideUpModalVisible: (visible: boolean) => void;
}

const WorkoutBarraSuperiorComponent: React.FC<WorkoutSuperior> = ({
  fecha,
  setIsSlideUpModalVisible,
}) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <Box>
      <HStack className="justify-between items-center">
        <Button
          className="bg-black"
          onPress={() => navigation.navigate('Dashboard')}
        >
          <ArrowLeft color="#ffffff" />
        </Button>
        <Text className="text-xl">
          {fecha instanceof Date
            ? fecha.toLocaleDateString() // Cambiar a cadena
            : 'Fecha no disponible'}
        </Text>
        <Button
          className="bg-black"
          onPress={() => {
            setIsSlideUpModalVisible(true);
          }}
        >
          <Ellipsis color="#ffffff" />
        </Button>
      </HStack>
    </Box>
  );
};

export default WorkoutBarraSuperiorComponent;
