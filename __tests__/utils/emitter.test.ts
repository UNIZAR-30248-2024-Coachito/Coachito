import { emitter } from '@/utils/emitter';
import { NativeEventEmitter } from 'react-native';

jest.mock('react-native', () => {
  return {
    NativeEventEmitter: jest.fn(),
  };
});

describe('NativeEventEmitter instance creation', () => {
  it('debería llamar a NativeEventEmitter constructor', () => {
    expect(NativeEventEmitter).toHaveBeenCalledTimes(1);
    expect(emitter).toBeInstanceOf(NativeEventEmitter);
  });
});
