import React from 'react';
import { render, act } from '@testing-library/react-native';
import CountdownTimer from '@/components/workout/CountDownTimer';

jest.mock('../../../styles.css', () => ({}));
jest.useFakeTimers();

describe('CountdownTimer', () => {
  it('debería renderizar el tiempo inicial correctamente', () => {
    const { getByText } = render(<CountdownTimer initialTime={10} />);

    expect(getByText('Tiempo restante: 10 segundos')).toBeTruthy();
  });

  it('debería decrementar el tiempo cada segundo', () => {
    const { getByText } = render(<CountdownTimer initialTime={3} />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('Tiempo restante: 2 segundos')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('Tiempo restante: 1 segundos')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('Tiempo restante: 0 segundos')).toBeTruthy();
  });

  it('debería llamar a la función onComplete cuando el tiempo llegue a cero', () => {
    const mockOnComplete = jest.fn();
    render(<CountdownTimer initialTime={3} onComplete={mockOnComplete} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockOnComplete).toHaveBeenCalledTimes(2);
  });

  it('debería detener el temporizador cuando el tiempo llega a cero', () => {
    const { getByText } = render(<CountdownTimer initialTime={3} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(getByText('Tiempo restante: 0 segundos')).toBeTruthy();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(getByText('Tiempo restante: 0 segundos')).toBeTruthy();
  });

  it('debería limpiar el temporizador cuando el componente se desmonte', () => {
    const spyClearInterval = jest.spyOn(global, 'clearInterval');
    const { unmount } = render(<CountdownTimer initialTime={10} />);

    unmount();

    expect(spyClearInterval).toHaveBeenCalledTimes(1);

    spyClearInterval.mockRestore();
  });
});
