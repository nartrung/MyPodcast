import ProfileModal from '@components/ProfileModal';
import {
  getDataFromAsyncStorage,
  keys,
  removeDataFromAsyncStorage,
} from '@utils/asyncStorage';
import colors from '@utils/colors';
import axios from 'axios';
import {FC, useState} from 'react';
import {View, StyleSheet, Pressable, Text, Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import {updateLogInState, updateProfile} from 'src/store/auth';

interface Props {}

const Setting: FC<Props> = props => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc muốn đăng xuất khỏi thiết bị này không?',
      [
        {
          text: 'Đăng xuất',
          style: 'default',
          onPress: async () => {
            try {
              const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
              await axios.post('http://10.0.2.2:8080/auth/logout', null, {
                headers: {
                  Authorization: 'Bearer ' + token,
                  'Content-Type': 'multipart/form-data;',
                },
              });
              await removeDataFromAsyncStorage(keys.AUTH_TOKEN);
              dispatch(updateProfile(null));
              dispatch(updateLogInState(false));
              Toast.show({
                type: 'success',
                text1: 'Đã đăng xuất',
              });
            } catch (error) {
              Toast.show({
                type: 'info',
                text1: 'Đã có lỗi xảy ra, vui lòng thử lại!',
              });
            }
          },
        },
        {
          text: 'Đóng',
          style: 'cancel',
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  const [showProfileModal, setShowProfileModal] = useState(false);
  return (
    <View style={styles.container}>
      <Pressable style={styles.item} onPress={() => setShowProfileModal(true)}>
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
      <Pressable style={styles.item} onPress={handleLogout}>
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
      <ProfileModal
        visibility={showProfileModal}
        onRequestClose={() => setShowProfileModal(false)}
      />
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
