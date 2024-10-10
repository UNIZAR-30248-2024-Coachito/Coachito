import React from 'react'
import { Text } from '../components/ui/text'
import { HStack } from '../components/ui/hstack'
import { Box } from '../components/ui/box'
import { VStack } from '../components/ui/vstack'
import { Button } from '../components/ui/button'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NavigationProps } from '@/types/navigation'
import { InputField, Input } from '../components/ui/input'


const AddExercise: React.FC = () => {
    const navigation = useNavigation<NavigationProps>()
    const route = useRoute()

    return (
        <Box className="flex-1 p-4">
        {/* Contenedor principal */}
        <VStack className="space-y-4">
            {/* Primera fila con 'Cancelar', 'Crear Rutina' y 'Guardar' */}
            <HStack className="justify-between items-center">
            <Button className='bg-black' onPress={() => navigation.navigate('Routine')}>
                <Text className="text-blue-500 ">Cancelar</Text>
            </Button>
            <Text className="text-xl">Agregar Ejercicio</Text>
            <Button className='bg-blue-500' onPress={() => navigation.navigate('Dashboard')}>
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
                    <InputField placeholder="Buscar Ejercicio" />
                </Input>
            </Box>
        </VStack>
    </Box>
    )
}


export default AddExercise