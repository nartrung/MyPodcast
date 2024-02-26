import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {}

const Setting: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.item}>
        <FontAwesome
          name="user"
          size={30}
          color={colors.CONTRAST}
          style={styles.icon}
        />
        <Text
          style={{
            color: colors.CONTRAST,
            fontFamily: 'opensans_bold',
          }}>
          Tài khoản
        </Text>
      </Pressable>
      <Pressable style={styles.item}>
        <FontAwesome
          name="power-off"
          size={30}
          color={colors.ERROR}
          style={styles.icon}
        />
        <Text style={{color: colors.ERROR, fontFamily: 'opensans_bold'}}>
          Đăng xuất
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  item: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.STROKE,
  },
  icon: {
    marginHorizontal: 12,
  },
});

export default Setting;
