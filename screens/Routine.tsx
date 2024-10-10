import React from 'react';
import { Box } from '../components/ui/box';
import '../styles.css';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import {} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';

const Routine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <Box className="flex-1 p-4">
      <Text className="text-xs text-blue-500">Lista de Entrenamientos</Text>
      <Button
        className="bg-blue-500"
        onPress={() => navigation.navigate('AddRoutine')}
      >
        <Text className="text-white ">Nueva Rutina</Text>
      </Button>
    </Box>
  );
};

export default Routine;
