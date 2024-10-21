import { convertIntervalToMinutes } from '../../utils/interval';

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
