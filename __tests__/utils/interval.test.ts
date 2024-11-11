import {
  convertIntervalToMinutes,
  convertIntervalToMinutesAndSeconds,
  convertIntervalToSeconds,
  convertSecondsToString,
  convertStringToInterval,
} from '@/utils/interval';

describe('convertIntervalToMinutes', () => {
  it('debería convertir un intervalo de horas, minutos y segundos correctamente', () => {
    const result = convertIntervalToMinutes('01:30:30'); // 1 hora, 30 minutos, 30 segundos
    expect(result).toBe(90); // 1 * 60 + 30 + Math.floor(30 / 60) = 90 minutos
  });

  it('debería convertir un intervalo solo de horas y minutos correctamente', () => {
    const result = convertIntervalToMinutes('02:45:00'); // 2 horas, 45 minutos
    expect(result).toBe(165); // 2 * 60 + 45 = 165 minutos
  });

  it('debería convertir un intervalo solo de minutos y segundos correctamente', () => {
    const result = convertIntervalToMinutes('00:15:45'); // 15 minutos, 45 segundos
    expect(result).toBe(15); // 0 * 60 + 15 + Math.floor(45 / 60) = 15 minutos
  });

  it('debería redondear hacia abajo si los segundos son menores a 60', () => {
    const result = convertIntervalToMinutes('00:00:59'); // 59 segundos
    expect(result).toBe(0); // 0 * 60 + 0 + Math.floor(59 / 60) = 0 minutos
  });

  it('debería convertir correctamente un intervalo con segundos que se redondean a un minuto', () => {
    const result = convertIntervalToMinutes('00:00:60'); // 60 segundos
    expect(result).toBe(1); // 0 * 60 + 0 + Math.floor(60 / 60) = 1 minuto
  });

  it('debería manejar correctamente intervalos sin horas', () => {
    const result = convertIntervalToMinutes('00:45:20'); // 45 minutos, 20 segundos
    expect(result).toBe(45); // 0 * 60 + 45 + Math.floor(20 / 60) = 45 minutos
  });

  it('debería manejar intervalos con solo horas sin minutos ni segundos', () => {
    const result = convertIntervalToMinutes('03:00:00'); // 3 horas
    expect(result).toBe(180); // 3 * 60 + 0 = 180 minutos
  });

  it('debería devolver 0 minutos para un intervalo de "00:00:00"', () => {
    const result = convertIntervalToMinutes('00:00:00'); // 0 horas, 0 minutos, 0 segundos
    expect(result).toBe(0);
  });
});

describe('convertIntervalToMinutesAndSeconds', () => {
  it('debería convertir un intervalo de minutos y segundos correctamente', () => {
    const result = convertIntervalToMinutesAndSeconds('00:15:45'); // 15 minutos, 45 segundos
    expect(result).toBe('15min y 45s');
  });

  it('debería convertir un intervalo de solo minutos correctamente', () => {
    const result = convertIntervalToMinutesAndSeconds('00:15:00'); // 15 minutos
    expect(result).toBe('15min');
  });

  it('debería convertir un intervalo de solo segundos correctamente', () => {
    const result = convertIntervalToMinutesAndSeconds('00:00:45'); // 45 segundos
    expect(result).toBe('45s');
  });

  it('debería devolver DESACTIVADO para intervalos nulos', () => {
    const result = convertIntervalToMinutesAndSeconds(null);
    expect(result).toBe('DESACTIVADO');
  });

  it('debería devolver DESACTIVADO para un intervalo de "00:00:00"', () => {
    const result = convertIntervalToMinutesAndSeconds('00:00:00'); // 0 horas, 0 minutos, 0 segundos
    expect(result).toBe('DESACTIVADO');
  });
});

describe('convertIntervalToSeconds', () => {
  it('debería convertir un intervalo de horas, minutos y segundos correctamente', () => {
    const result = convertIntervalToSeconds('01:30:30'); // 1 hora, 30 minutos, 30 segundos
    expect(result).toBe(5430); // 1 * 3600 + 30 * 60 + 30 = 5430 segundos
  });

  it('debería convertir un intervalo solo de horas y minutos correctamente', () => {
    const result = convertIntervalToSeconds('02:45:00'); // 2 horas, 45 minutos
    expect(result).toBe(9900); // 2 * 3600 + 45 * 60 = 9900 segundos
  });

  it('debería convertir un intervalo solo de minutos y segundos correctamente', () => {
    const result = convertIntervalToSeconds('00:15:45'); // 15 minutos, 45 segundos
    expect(result).toBe(945); // 15 * 60 + 45 = 945 segundos
  });

  it('debería convertir correctamente un intervalo con segundos que se redondean a un minuto', () => {
    const result = convertIntervalToSeconds('00:00:60'); // 60 segundos
    expect(result).toBe(60); // 60 segundos
  });

  it('debería manejar correctamente intervalos sin horas', () => {
    const result = convertIntervalToSeconds('00:45:20'); // 45 minutos, 20 segundos
    expect(result).toBe(2720); // 45 * 60 + 20 = 2720 segundos
  });

  it('debería manejar intervalos con solo horas sin minutos ni segundos', () => {
    const result = convertIntervalToSeconds('03:00:00'); // 3 horas
    expect(result).toBe(10800); // 3 * 3600 = 10800 segundos
  });

  it('debería devolver 0 segundos para un intervalo nulo', () => {
    const result = convertIntervalToSeconds(null);
    expect(result).toBe(0);
  });

  it('debería devolver 0 segundos para un intervalo de "00:00:00"', () => {
    const result = convertIntervalToSeconds('00:00:00'); // 0 horas, 0 minutos, 0 segundos
    expect(result).toBe(0);
  });
});

describe('convertStringToInterval', () => {
  it('debería convertir una cadena de minutos y segundos correctamente', () => {
    const result = convertStringToInterval('5 min 30 s');
    expect(result).toBe('00:05:30'); // 5 minutos, 30 segundos
  });

  it('debería convertir una cadena solo con minutos correctamente', () => {
    const result = convertStringToInterval('15 min');
    expect(result).toBe('00:15:00'); // 15 minutos, 0 segundos
  });

  it('debería convertir una cadena solo con segundos correctamente', () => {
    const result = convertStringToInterval('45 s');
    expect(result).toBe('00:00:45'); // 0 minutos, 45 segundos
  });

  it('debería devolver "00:00:00" para una cadena vacía', () => {
    const result = convertStringToInterval('');
    expect(result).toBe('00:00:00'); // Sin minutos ni segundos
  });

  it('debería manejar una cadena con espacios adicionales correctamente', () => {
    const result = convertStringToInterval('  7  min   20   s  ');
    expect(result).toBe('00:07:20'); // 7 minutos, 20 segundos
  });

  it('debería manejar una cadena sin espacios entre número y unidades correctamente', () => {
    const result = convertStringToInterval('10min5s');
    expect(result).toBe('00:10:05'); // 10 minutos, 5 segundos
  });

  it('debería ignorar valores que no contengan minutos o segundos válidos', () => {
    const result = convertStringToInterval('hour');
    expect(result).toBe('00:00:00'); // Sin minutos ni segundos válidos
  });

  describe('convertSecondsToString', () => {
    it('debería convertir 0 segundos a "0 min 0 s"', () => {
      expect(convertSecondsToString(0)).toBe('0 min 0 s');
    });

    it('debería convertir 59 segundos a "0 min 59 s"', () => {
      expect(convertSecondsToString(59)).toBe('0 min 59 s');
    });

    it('debería convertir 60 segundos a "1 min 0 s"', () => {
      expect(convertSecondsToString(60)).toBe('1 min 0 s');
    });

    it('debería convertir 120 segundos a "2 min 0 s"', () => {
      expect(convertSecondsToString(120)).toBe('2 min 0 s');
    });

    it('debería convertir 125 segundos a "2 min 5 s"', () => {
      expect(convertSecondsToString(125)).toBe('2 min 5 s');
    });

    it('debería convertir 300 segundos a "5 min 0 s"', () => {
      expect(convertSecondsToString(300)).toBe('5 min 0 s');
    });
  });
});
