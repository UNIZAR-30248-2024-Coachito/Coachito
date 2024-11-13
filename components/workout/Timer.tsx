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

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min y ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}min y ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return <Text className="text-white mb-4 text-xl">{formatTime(time)}</Text>;
};

export default Timer;
