import React from 'react'
import { Box } from '../components/ui/box'
import '../styles.css'
import { HStack } from '../components/ui/hstack'
import { VStack } from '../components/ui/vstack'
import { Text } from '../components/ui/text'
import { Button } from '../components/ui/button'
import { InputField, Input } from '../components/ui/input'
import {} from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { NavigationProps } from '@/types/navigation'


const Routine: React.FC = () => {
  const navigation = useNavigation<NavigationProps>()
  const route = useRoute()

  return (
    <Box className="flex-1 p-4">
      <Text className="text-xs text-blue-500">Lista de Entrenamientos</Text>
      <Button className='bg-blue-500' onPress={() => navigation.navigate('AddRoutine')}>
          <Text className="text-white ">Nueva Rutina</Text>
      </Button>
    </Box>  
)
}

export default Routine
