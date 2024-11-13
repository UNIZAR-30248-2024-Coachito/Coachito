import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from '@/components/ui/text';
import SlideUpBaseModal from '@/components/shared/SlideUpBaseModal';

jest.mock('../../../styles.css', () => ({}));

const mockSetIsModalVisible = jest.fn();

describe('SlideUpBaseModal', () => {
  const sampleButtons = [
    <Text key="1">Button 1</Text>,
    <Text key="2">Button 2</Text>,
    <Text key="3">Button 3</Text>,
  ];
  const sampleTitle = 'Sample Modal Title';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería mostrarse cuando isVisible es true', () => {
    const { getByTestId } = render(
      <SlideUpBaseModal
        buttons={sampleButtons}
        title={sampleTitle}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    expect(getByTestId('modal-content')).toBeTruthy();
    expect(getByTestId('modal-touchable')).toBeTruthy();
  });

  it('no debería mostrarse cuando isVisible es false', () => {
    const { queryByTestId } = render(
      <SlideUpBaseModal
        buttons={sampleButtons}
        title={sampleTitle}
        isVisible={false}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    expect(queryByTestId('modal-content')).toBeNull();
    expect(queryByTestId('modal-touchable')).toBeNull();
  });

  it('debería renderizar el título correctamente', () => {
    const { getByText } = render(
      <SlideUpBaseModal
        buttons={sampleButtons}
        title={sampleTitle}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    expect(getByText(sampleTitle)).toBeTruthy();
  });

  it('debería renderizar todos los botones pasados en la prop buttons', () => {
    const { getByText } = render(
      <SlideUpBaseModal
        buttons={sampleButtons}
        title={sampleTitle}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    sampleButtons.forEach((button, index) => {
      expect(getByText(`Button ${index + 1}`)).toBeTruthy();
    });
  });

  it('debería llamar a setIsModalVisible con false al presionar fuera del contenido del modal', () => {
    const { getByTestId } = render(
      <SlideUpBaseModal
        buttons={sampleButtons}
        title={sampleTitle}
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
      <SlideUpBaseModal
        buttons={sampleButtons}
        title={sampleTitle}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    fireEvent(getByTestId('modal'), 'onRequestClose');

    expect(mockSetIsModalVisible).toHaveBeenCalledWith(false);
  });

  it('debería mostrar un separador entre los botones', () => {
    const { getAllByTestId } = render(
      <SlideUpBaseModal
        buttons={sampleButtons}
        title={sampleTitle}
        isVisible={true}
        setIsModalVisible={mockSetIsModalVisible}
      />
    );

    const dividers = getAllByTestId('divider');
    expect(dividers.length).toBe(sampleButtons.length - 1);
  });
});
