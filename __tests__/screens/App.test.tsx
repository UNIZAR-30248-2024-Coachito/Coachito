import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../screens/App';

jest.mock('../../styles.css', () => ({}));

jest.mock('../../screens/Dashboard', () => {
  const MockComponent = () => <div>Dashboard</div>;
  MockComponent.displayName = 'Dashboard';
  return MockComponent;
});

jest.mock('../../screens/Routine', () => {
  const MockComponent = () => <div>Routine</div>;
  MockComponent.displayName = 'Routine';
  return MockComponent;
});

jest.mock('../../screens/Profile', () => {
  const MockComponent = () => <div>Profile</div>;
  MockComponent.displayName = 'Profile';
  return MockComponent;
});

jest.mock('../../screens/DetailsWorkout', () => {
  const MockComponent = () => <div>DetailsWorkout</div>;
  MockComponent.displayName = 'DetailsWorkout';
  return MockComponent;
});

jest.mock('../../screens/DetailsRoutine', () => {
  const MockComponent = () => <div>DetailsRoutine</div>;
  MockComponent.displayName = 'DetailsRoutine';
  return MockComponent;
});

jest.mock('../../screens/AddExercise', () => {
  const MockComponent = () => <div>AddExercise</div>;
  MockComponent.displayName = 'AddExercise';
  return MockComponent;
});

jest.mock('../../screens/AddRoutine', () => {
  const MockComponent = () => <div>AddRoutine</div>;
  MockComponent.displayName = 'AddRoutine';
  return MockComponent;
});

jest.mock('../../screens/EditRoutine', () => {
  const MockComponent = () => <div>EditRoutine</div>;
  MockComponent.displayName = 'EditRoutine';
  return MockComponent;
});

jest.mock('../../screens/AddExerciseEdit', () => {
  const MockComponent = () => <div>AddExerciseEdit</div>;
  MockComponent.displayName = 'AddExerciseEdit';
  return MockComponent;
});

jest.mock('../../screens/StartWorkout', () => {
  const MockComponent = () => <div>StartWorkout</div>;
  MockComponent.displayName = 'StartWorkout';
  return MockComponent;
});

jest.mock('../../screens/DetailsExercise', () => {
  const MockComponent = () => <div>DetailsExercise</div>;
  MockComponent.displayName = 'DetailsExercise';
  return MockComponent;
});

describe('App Navigation', () => {
  it('debería renderizar la pantalla de Dashboard correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('Dashboard'));

    expect(getByText('Dashboard')).toBeTruthy();
  });

  it('debería renderizar la pantalla de Routine correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('Dashboard'));

    fireEvent.press(getByText('Routine'));
  });

  it('debería renderizar la pantalla de Profile correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('Profile'));

    expect(getByText('Profile')).toBeTruthy();
  });

  it('debería renderizar la pantalla de DetailsRoutine correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('DetailsRoutine'));

    expect(getByText('DetailsRoutine')).toBeTruthy();
  });

  it('debería renderizar la pantalla de AddExercise correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('AddExercise'));

    expect(getByText('AddExercise')).toBeTruthy();
  });

  it('debería renderizar la pantalla de AddRoutine correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('AddRoutine'));

    expect(getByText('AddRoutine')).toBeTruthy();
  });

  it('debería renderizar la pantalla de EditRoutine correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('EditRoutine'));

    expect(getByText('EditRoutine')).toBeTruthy();
  });

  it('debería renderizar la pantalla de StartWorkout correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('StartWorkout'));

    expect(getByText('StartWorkout')).toBeTruthy();
  });

  it('debería renderizar la pantalla de DetailsWorkout correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('DetailsWorkout'));

    expect(getByText('DetailsWorkout')).toBeTruthy();
  });

  it('debería renderizar la pantalla de DetailsExercise correctamente', () => {
    const { getByText } = render(<App />);

    fireEvent.press(getByText('DetailsExercise'));

    expect(getByText('DetailsExercise')).toBeTruthy();
  });
});
