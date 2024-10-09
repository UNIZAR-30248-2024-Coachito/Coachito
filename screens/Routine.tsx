import React from 'react'
import { Box } from '../components/ui/box'
import '../styles.css'
import { HStack } from '../components/ui/hstack'
import { VStack } from '../components/ui/vstack'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { InputField, Input } from '../components/ui/input'
import {} from 'lucide-react-native'

const Routine: React.FC = () => {
  return (
    <Box className="flex-1 p-4">
      {/* Contenedor principal */}
      <VStack className="space-y-4">
        {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
        <HStack className="justify-between items-center">
          <Text className="text-xl">Cancelar</Text>
          <Text className="text-xl">Crear Rutina</Text>
          <Button>
            <Text className="text-black">Guardar</Text>
          </Button>
        </HStack>

        {/* Input para el título de la rutina */}
        <Box className="w-full">
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

        {/* Texto e botón para agregar ejercicios */}
        <VStack className="space-y-4">
          <Text className="text-md">
            Empieza agregando un ejercicio a tu rutina
          </Text>
          <Button className="flex-row items-center">
            <Text className="text-black">Agregar ejercicio</Text>
          </Button>
        </VStack>
      </VStack>
    </Box>
  )
}

export default Routine
