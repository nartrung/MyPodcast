import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
}

const AppButton: FC<Props> = ({title, onPress, busy}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {!busy ? <Text style={styles.text}>{title}</Text> : <Loader />}
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
