import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  source?: string;
}

const ProfileAvatarField: FC<Props> = ({source}) => {
  return (
    <View style={styles.container}>
      {source ? (
        <Image source={{uri: source}} style={styles.avatarImage} />
      ) : (
        <View style={styles.avatarImage}>
          <FontAwesome name="user" size={50} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.CONTRAST,
    marginVertical: 10,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileAvatarField;
