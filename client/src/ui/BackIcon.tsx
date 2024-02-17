import colors from '@utils/colors';
import {FC} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

interface Props {
  onIconPress?(): void;
}

const BackIcon: FC<Props> = ({onIconPress}) => {
  return (
    <Pressable onPress={onIconPress}>
      <Icon
        style={styles.backIcon}
        name="chevron-thin-left"
        color={colors.PRIMARY}
        size={30}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    color: colors.CONTRAST,
    marginBottom: 24,
    marginRight: -24,
    position: 'absolute',
    right: '50%',
    bottom: '50%',
  },
});

export default BackIcon;
