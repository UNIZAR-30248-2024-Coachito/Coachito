import Timer from '@/components/workout/Timer';
import React, { render, act } from '@testing-library/react-native';

describe('Timer', () => {
  jest.useFakeTimers();

  it('debería mostrar el tiempo formateado correctamente', () => {
    const { getByText } = render(<Timer active={false} />);

    expect(getByText('0s')).toBeTruthy();
  });

  it('debería incrementar el tiempo cada segundo cuando la propiedad active es true', () => {
    const { getByText } = render(<Timer active={true} />);

    // Verifica el estado inicial
    expect(getByText('0s')).toBeTruthy();

    // Avanza el temporizador por 1 segundo
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Verifica que se haya incrementado a 1 segundo
    expect(getByText('1s')).toBeTruthy();

    // Avanza otro segundo y verifica
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('2s')).toBeTruthy();
  });

  it('debería llamar a onTimeUpdate con el tiempo correcto', () => {
    const onTimeUpdateMock = jest.fn();
    render(<Timer active={true} onTimeUpdate={onTimeUpdateMock} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(onTimeUpdateMock).toHaveBeenCalledWith(1);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(onTimeUpdateMock).toHaveBeenCalledWith(3);
  });

  it('debería mostrar el tiempo formateado correctamente con minutos', () => {
    const { getByText } = render(<Timer active={true} />);

    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(getByText('1min y 0s')).toBeTruthy();
  });

  it('debería mostrar "Xs" si el tiempo es menor a 1 minuto', () => {
    const { getByText } = render(<Timer active={true} />);

    act(() => {
      jest.advanceTimersByTime(45000);
    });

    expect(getByText('45s')).toBeTruthy();
  });

  it('debería mostrar "Xmin y Ys" si el tiempo supera 1 minuto', () => {
    const { getByText } = render(<Timer active={true} />);

    act(() => {
      jest.advanceTimersByTime(130000);
    });

    expect(getByText('2min y 10s')).toBeTruthy();
  });

  it('debería mostrar "Xh Ymin y Zs" si el tiempo supera 1 minuto', () => {
    const { getByText } = render(<Timer active={true} />);

    act(() => {
      jest.advanceTimersByTime(5400000);
    });

    expect(getByText('1h 30min y 0s')).toBeTruthy();
  });
});
