import React from 'react';
import { Box } from '../components/ui/box';
import '../styles.css';
import { HStack } from '../components/ui/hstack';
import { VStack } from '../components/ui/vstack';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { InputField, Input } from '../components/ui/input';
import {} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import ExerciseListCard from '@/components/exercise/ExerciseListCard';

const SaveRoutine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <Box className="flex-1">
      {/* Contenedor principal */}
      <VStack className="p-4">
        {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
        <HStack className="justify-between items-center">
          <Text className="text-xl text-blue-500">Cancelar</Text>
          <Text className="text-xl">Crear Rutina</Text>
          <Button
            className="bg-blue-500"
            onPress={() => navigation.navigate('Routine')}
          >
            <Text className="text-white ">Guardar</Text>
          </Button>
        </HStack>

        {/* Input para el título de la rutina */}
        <Box className="w-full pt-2">
          <Input
            variant="outline"
            size="md"
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField placeholder="Título de la rutina" />
          </Input>
        </Box>
        <ExerciseListCard />
      </VStack>
    </Box>
  );
};

export default SaveRoutine;
