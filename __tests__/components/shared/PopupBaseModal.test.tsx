import React from 'react';
import PopupBaseModal from '@/components/shared/PopupBaseModal';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from '../../../components/ui/text';

const mockSetIsModalVisible = jest.fn();

describe('PopupBaseModal', () => {
  const sampleComponents = [
    <Text key="1">Sample Component 1</Text>,
    <Text key="2">Sample Component 2</Text>,
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrarse cuando isVisible es true', () => {
    const { getByTestId } = render(
      <PopupBaseModal
        components={sampleComponents}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    expect(getByTestId('modal-content')).toBeTruthy();
    expect(getByTestId('modal-touchable')).toBeTruthy();
  });

  it('no debería mostrarse cuando isVisible es false', () => {
    const { queryByTestId } = render(
      <PopupBaseModal
        components={sampleComponents}
        isVisible={false}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    expect(queryByTestId('modal-content')).toBeNull();
    expect(queryByTestId('modal-touchable')).toBeNull();
  });

  it('debería renderizar los componentes pasados en la prop components', () => {
    const { getByText } = render(
      <PopupBaseModal
        components={sampleComponents}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    expect(getByText('Sample Component 1')).toBeTruthy();
    expect(getByText('Sample Component 2')).toBeTruthy();
  });

  it('debería llamar a setIsModalVisible con false al presionar fuera del contenido del modal', () => {
    const { getByTestId } = render(
      <PopupBaseModal
        components={sampleComponents}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    const outsideTouchable = getByTestId('modal-touchable');
    fireEvent.press(outsideTouchable);

    expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
  });

  it('debería llamar a setIsModalVisible con false al ejecutar onRequestClose en el modal', () => {
    const { getByTestId } = render(
      <PopupBaseModal
        components={sampleComponents}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    fireEvent(getByTestId('modal'), 'onRequestClose');

    expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
  });
});
