import React from 'react'
import { Text } from '../ui/text'
import { Box } from '../ui/box'
import { HStack } from '../ui/hstack'
import { VStack } from '../ui/vstack'
import '../../styles.css'

interface WorkoutHeaderResume {
  workoutName: string
  workoutDate: Date
  workoutTime: number
  workoutVolume: number
}

const WorkoutHeaderResumeComponent: React.FC<WorkoutHeaderResume> = ({
  workoutName,
  workoutDate,
  workoutTime,
  workoutVolume,
}) => {
  function calculateDaysDifference(date: Date): number {
    const currentDate = new Date()

    const differenceInMillis = currentDate.getTime() - date.getTime()

    const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24)

    return Math.floor(differenceInDays)
  }

  const daysOffset = calculateDaysDifference(workoutDate)

  return (
    <Box>
      <HStack className="items-center mb-2 space-x-2">
        <VStack>
          <Text className="text-xl font-bold mb-2 text-white">
            {workoutName}
          </Text>
          <Text className="text-xs text-gray-400">
            hace {daysOffset} {daysOffset > 1 ? 'días' : 'día'}
          </Text>
        </VStack>
      </HStack>
      <HStack className="justify-start gap-x-8 mb-4">
        <VStack>
          <Text className="text-gray-400">Tiempo</Text>
          <Text className="text-white">{workoutTime} min</Text>
        </VStack>
        <VStack>
          <Text className="text-gray-400">Volumen</Text>
          <Text className="text-white">{workoutVolume} Kg</Text>
        </VStack>
      </HStack>
    </Box>
  )
}

export default WorkoutHeaderResumeComponent
