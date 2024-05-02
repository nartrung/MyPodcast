import Loader from '@ui/Loader';
import ModalContainer from '@ui/ModalContainer';
import ProfileAvatarField from '@ui/ProfileAvatarField';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import colors from '@utils/colors';
import axios, {AxiosError} from 'axios';
import deepEqual from 'deep-equal';
import {FastField} from 'formik';
import {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store';
import {getAuthState, updateProfile} from 'src/store/auth';

interface Props {
  visibility: boolean;
  onRequestClose(): void;
}

interface ProfileInfo {
  name: string | undefined;
  avatar?: string;
}

const ProfileModal: FC<Props> = ({visibility, onRequestClose}) => {
  const [userInfo, setUserInfo] = useState<ProfileInfo>({name: ''});
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const profile = useSelector(
    (rootState: RootState) => getAuthState(rootState).profile,
  );

  const isSameProfile = deepEqual(userInfo, {
    name: profile?.name,
    avatar: profile?.avatar,
  });
  useEffect(() => {
    if (profile) setUserInfo({name: profile.name, avatar: profile.avatar});
  }, [profile]);

  const handleClose = () => {
    onRequestClose();
  };

  const handleChangeAvatar = async () => {
    try {
      const {path} = await ImagePicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
      });
      setUserInfo({...userInfo, avatar: path});
    } catch (error) {}
  };
  const dispatch = useDispatch();
  const handleSubmit = async () => {
    if (userInfo.name?.trim() === '') {
      return Alert.alert('Lỗi', 'Tên không thể để trống!');
    }
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('name', userInfo.name);
      if (userInfo.avatar) {
        formData.append('avatar', {
          name: 'User Avatar' + Date.now().toString(),
          type: 'image/jpeg',
          uri: userInfo.avatar,
        });
      }
      const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
      const {data} = await axios.post(
        'http://10.0.2.2:8080/auth/update-profile',
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'multipart/form-data;',
          },
        },
      );

      dispatch(updateProfile(data.profile));
      onRequestClose();
      queryClient.invalidateQueries({queryKey: ['favorites-podcast']});
      queryClient.invalidateQueries({queryKey: ['uploaded-podcast']});
      Toast.show({
        type: 'success',
        text1: 'Thay đổi thông tin thành công',
      });
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError)
        Toast.show({
          type: 'error',
          text1: 'Đã có lỗi xảy ra, vui lòng thử lại!',
        });
    }
    setBusy(false);
  };

  return (
    <ModalContainer visible={visibility} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Pressable onPress={handleClose}>
            <Text
              style={{color: colors.PRIMARY, fontFamily: 'opensans_regular'}}>
              Hủy
            </Text>
          </Pressable>
          <Text style={{color: colors.CONTRAST, fontFamily: 'opensans_bold'}}>
            Chỉnh sửa hồ sơ
          </Text>
          <Pressable onPress={handleSubmit} style={{flexDirection: 'row'}}>
            {!isSameProfile ? (
              <Text
                style={{color: colors.PRIMARY, fontFamily: 'opensans_bold'}}>
                Lưu
              </Text>
            ) : null}
            {busy ? <Loader /> : null}
          </Pressable>
        </View>
        <View style={styles.body}>
          <Pressable onPress={handleChangeAvatar}>
            <ProfileAvatarField source={userInfo?.avatar} />
          </Pressable>
        </View>
        <View style={styles.footer}>
          <Text style={{fontFamily: 'opensans_bold'}}>Tên</Text>
          <TextInput
            defaultValue={profile?.name}
            style={styles.nameInput}
            onChangeText={text => {
              setUserInfo({...userInfo, name: text});
            }}></TextInput>
        </View>
      </View>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 600,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomColor: colors.STROKE,
    borderBottomWidth: 1,
  },
  body: {
    alignItems: 'center',
    marginVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    borderBottomColor: colors.STROKE,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '80%',
    fontFamily: 'opensans_bold',
  },
});

export default ProfileModal;
