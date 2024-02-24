import ModalContainer from '@ui/ModalContainer';
import {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface Props<T> {
  visible: boolean;
  onRequestClose(): void;
  options: T[];
  renderItem(item: T): JSX.Element;
  poster?: string;
  title?: string;
}

const OptionsModal = <T extends any>({
  visible,
  onRequestClose,
  options,
  renderItem,
  poster,
  title,
}: Props<T>) => {
  return (
    <ModalContainer onRequestClose={onRequestClose} visible={visible}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={
            poster
              ? {
                  uri: poster,
                }
              : require('../assets/images/DummyPoster.png')
          }
        />
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      {options.map((item, index) => {
        return <View key={index}>{renderItem(item)}</View>;
      })}
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 140,
    marginVertical: 24,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  title: {
    fontFamily: 'opensans_bold',
    fontSize: 16,
    paddingTop: 10,
  },
});

export default OptionsModal;
