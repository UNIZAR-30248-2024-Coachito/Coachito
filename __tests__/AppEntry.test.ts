import { registerRootComponent } from 'expo';
import App from '../screens/App';
import '../AppEntry';

jest.mock('expo', () => ({
  registerRootComponent: jest.fn(),
}));

jest.mock('../screens/App', () => {
  return jest.fn();
});

describe('AppEntry', () => {
  it('debería registrar el componente App con registerRootComponent', () => {
    expect(registerRootComponent).toHaveBeenCalledWith(App);
  });
});
