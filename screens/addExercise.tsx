import React from 'react';
import { Text } from '../components/ui/text';
import { HStack } from '../components/ui/hstack';
import { Box } from '../components/ui/box';
import { VStack } from '../components/ui/vstack';
import { Button } from '../components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '@/types/navigation';
import { InputField, Input } from '../components/ui/input';
import { Pressable } from 'react-native';
import { useState } from 'react';

interface Ejercicio {
  name: string;
  foto: string;
}

const AddExercise: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [presionado, setPresionado] = useState<boolean[]>([false, false]);

  const ejercicios: Ejercicio[] = [
    {
      name: 'Press de banca inclinado',
      foto: 'Foto1',
    },
    {
      name: 'Sentadillas con Barra',
      foto: 'Foto2',
    },
  ];

  const handlePress = (index: number) => {
    // Crea una copia del estado actual
    const newPresionado = [...presionado];
    // Cambia el estado del ejercicio presionado
    newPresionado[index] = !newPresionado[index];
    // Actualiza el estado
    setPresionado(newPresionado);
  };

  const getStyle = (index: number) => ({
    backgroundColor: presionado[index] ? 'black' : 'blue',
  });

  return (
    <Box className="flex-1 p-4">
      {/* Contenedor principal */}
      <VStack className="space-y-4">
        {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
        <HStack className="justify-between items-center">
          <Button
            className="bg-black"
            onPress={() => navigation.navigate('Routine')}
          >
            <Text className="text-blue-500 ">Cancelar</Text>
          </Button>
          <Text className="text-xl">Agregar Ejercicio</Text>
          <Button
            className="bg-blue-500"
            onPress={() => navigation.navigate('Dashboard')}
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
            <InputField className="text-white" placeholder="Buscar Ejercicio" />
          </Input>
        </Box>
        {/* Mostrar lista de ejercicios */}
        <VStack className="space-y-2 p-4">
          {ejercicios.map((ejercicio, index) => (
            <Pressable
              key={index}
              className="items-left p-4"
              onPress={() => handlePress(index)}
              style={getStyle(index)}
            >
              <Text className="text-lg">{ejercicio.name}</Text>
              <Text>{ejercicio.foto}</Text>
            </Pressable>
          ))}
        </VStack>
      </VStack>
    </Box>
  );
};

export default AddExercise;
