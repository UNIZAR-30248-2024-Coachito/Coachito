import React from 'react';
import { render } from '@testing-library/react-native';
import Template from '../../../components/shared/Template';
import { Text } from '../../../components/ui/text';

const mockBottomBarComponent = <Text>Mocked BottomBar</Text>;

jest.mock('../../../components/shared/BottomBar', () => {
  const mockBottomBar = () => mockBottomBarComponent;
  return mockBottomBar;
});

describe('Template Component', () => {
  it('debería renderizar el componente Template correctamente', () => {
    const { getByText } = render(
      <Template>
        <Text>Contenido de prueba</Text>
      </Template>
    );

    expect(getByText('Contenido de prueba')).toBeTruthy();

    expect(getByText('Mocked BottomBar')).toBeTruthy();
  });
});
