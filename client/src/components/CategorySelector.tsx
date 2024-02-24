import ModalContainer from '@ui/ModalContainer';
import colors from '@utils/colors';
import {useState} from 'react';
import {StyleSheet, Pressable, Text, ScrollView} from 'react-native';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props<T> {
  visible?: boolean;
  data: T[];
  renderItem(item: T): JSX.Element;
  onSelect(item: T, index: number): void;
  onRequestClose?(): void;
}

const CategorySelector = <T extends any>({
  data,
  visible = false,
  onRequestClose,
  renderItem,
  onSelect,
}: Props<T>) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelection = (item: T, index: number) => {
    setSelectedIndex(index);
    onSelect(item, index);
    onRequestClose && onRequestClose();
  };
  return (
    <ModalContainer visible={visible} onRequestClose={onRequestClose}>
      <Text style={styles.title}>Thể loại</Text>
      <ScrollView>
        {data.map((item, index) => {
          return (
            <Pressable
              onPress={() => handleSelection(item, index)}
              key={index}
              style={styles.selectionContainer}>
              {selectedIndex === index ? (
                <MaterialComIcons
                  name="radiobox-marked"
                  color={colors.PRIMARY}
                />
              ) : (
                <MaterialComIcons
                  name="radiobox-blank"
                  color={colors.PRIMARY}
                />
              )}
              {renderItem(item)}
            </Pressable>
          );
        })}
      </ScrollView>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0 0 0 / 0.4)',
    zIndex: -1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    width: '90%',
    maxHeight: '60%',
    borderRadius: 16,
    padding: 12,
    backgroundColor: colors.SECONDARY,
  },
  title: {
    fontFamily: 'opensans_bold',
    color: colors.PRIMARY,
    fontSize: 18,
    paddingVertical: 8,
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CategorySelector;
