import React, { useEffect, useState } from 'react';
import { VStack } from '../ui/vstack';
import { Text } from '../ui/text';

interface CountdownTimerProps {
  initialTime: number;
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialTime,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (onComplete) onComplete();
    }

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  return (
    <VStack className="gap-4">
      <Text className="text-white">Tiempo restante: {timeLeft} segundos</Text>
    </VStack>
  );
};

export default CountdownTimer;
