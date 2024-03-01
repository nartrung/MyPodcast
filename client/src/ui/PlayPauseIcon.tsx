import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {
  color?: string;
  playing?: boolean;
  onPress?(): void;
}

const PlayPauseIcon: FC<Props> = ({
  color = colors.SECONDARY,
  playing,
  onPress,
}) => {
  return (
    <Pressable style={styles.icon} onPress={onPress}>
      {playing ? (
        <AntDesign name="pause" size={28} color={color} />
      ) : (
        <AntDesign name="caretright" size={28} color={color} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  icon: {
    paddingHorizontal: 10,
  },
});

export default PlayPauseIcon;
