import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

interface TimerProps {
  active: boolean;
  onTimeUpdate?: (tiempo: number) => void;
}

const Timer: React.FC<TimerProps> = ({ active, onTimeUpdate }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalo: NodeJS.Timeout;

    if (active) {
      intervalo = setInterval(() => {
        setTime((prevTiempo) => {
          const newTime = prevTiempo + 1;
          if (onTimeUpdate) {
            onTimeUpdate(newTime);
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      clearInterval(intervalo);
    };
  }, [active, onTimeUpdate]);

  return (
    <>
      <Text className="text-white mb-4 text-md">Tiempo: {time} segundos</Text>
    </>
  );
};

export default Timer;
