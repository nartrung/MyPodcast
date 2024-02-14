import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

interface Props {
  title: string;
  onPress?(): void;
}

const AppButton: FC<Props> = ({title, onPress}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    marginTop: 6,
  },
  text: {
    color: colors.SECONDARY,
    fontSize: 20,
    fontFamily: 'opensans_bold',
  },
});

export default AppButton;
