import {
  calculateDaysDifferenceNow,
  formatToChartLabel,
} from '../../utils/date';

describe('calculateDaysDifferenceNow', () => {
  beforeAll(() => {
    // Congelar la fecha actual en una constante para evitar que cambie durante las pruebas
    jest.useFakeTimers().setSystemTime(new Date('2024-10-11').getTime());
  });

  afterAll(() => {
    jest.useRealTimers(); // Restaurar temporizador real
  });

  it('debería devolver 0 si la fecha es hoy', () => {
    const today = '2024-10-11';
    const result = calculateDaysDifferenceNow(today);
    expect(result).toBe(0);
  });

  it('debería devolver la diferencia correcta cuando la fecha es en el pasado', () => {
    const pastDate = '2024-10-01';
    const result = calculateDaysDifferenceNow(pastDate);
    expect(result).toBe(10); // 10 días de diferencia entre 2024-10-01 y 2024-10-11
  });

  it('debería devolver la diferencia correcta cuando la fecha es en el futuro', () => {
    const futureDate = '2024-10-20';
    const result = calculateDaysDifferenceNow(futureDate);
    expect(result).toBe(-9); // 9 días en el futuro desde 2024-10-11
  });

  it('debería devolver la diferencia correcta para una fecha en el pasado lejano', () => {
    const oldDate = '2020-10-11';
    const result = calculateDaysDifferenceNow(oldDate);
    expect(result).toBe(1461); // Diferencia de 4 años completos (incluye un año bisiesto)
  });

  it('debería devolver la diferencia correcta para una fecha en el futuro lejano', () => {
    const futureOldDate = '2030-10-11';
    const result = calculateDaysDifferenceNow(futureOldDate);
    expect(result).toBe(-2191); // Diferencia de 6 años completos (incluye un año bisiesto)
  });
});

describe('formatToChartLabel', () => {
  it('debería formatear correctamente una fecha en el formato "DD MMM" en español', () => {
    const result = formatToChartLabel('2024-10-11T00:00:00Z');
    expect(result).toBe('11 Oct');
  });

  it('debería formatear correctamente una fecha en el formato "DD MMM" con un mes diferente', () => {
    const result = formatToChartLabel('2024-12-25T00:00:00Z');
    expect(result).toBe('25 Dec');
  });

  it('debería formatear correctamente una fecha en el primer día del mes', () => {
    const result = formatToChartLabel('2024-05-01T00:00:00Z');
    expect(result).toBe('01 May');
  });

  it('debería formatear correctamente una fecha en el último día del mes', () => {
    const result = formatToChartLabel('2024-03-31T00:00:00Z');
    expect(result).toBe('31 Mar');
  });

  it('debería manejar correctamente fechas de años anteriores', () => {
    const result = formatToChartLabel('2020-01-15T00:00:00Z');
    expect(result).toBe('15 Jan');
  });
});
