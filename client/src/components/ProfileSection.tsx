import ProfileAvatarField from '@ui/ProfileAvatarField';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {UserProfile} from 'src/store/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {ProfileStackNavigitionScreen} from 'src/@type/navigation';
import axios from 'axios';
import Toast from 'react-native-toast-message';

interface Props {
  profile?: UserProfile | null;
}

const ProfileSection: FC<Props> = ({profile}) => {
  const navigation =
    useNavigation<NavigationProp<ProfileStackNavigitionScreen>>();

  const resendVerify = async () => {
    try {
      await axios.post('http://10.0.2.2:8080/auth/reverify-email', {
        userId: profile?.id || '',
      });
      navigation.navigate('EmailVerification', {
        userInfo: {
          email: profile?.email || '',
          name: profile?.name || '',
          id: profile?.id || '',
        },
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra!',
      });
    }
  };

  if (!profile) return null;
  return (
    <View style={styles.container}>
      <ProfileAvatarField source={profile.avatar} />
      <View>
        <Text style={styles.name}>{profile.name}</Text>
        <View style={styles.emailContainer}>
          <Text style={styles.email}>{profile.email} </Text>
          {profile.verified ? (
            <MaterialIcons name="verified-user" size={14} color="#3693E8" />
          ) : (
            <Pressable onPress={resendVerify}>
              <Text style={styles.verify}>Xác thực</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.followContainer}>
          <Text style={styles.follow}>{profile.followers} Người theo dõi</Text>
          <Text style={styles.follow}>{profile.followings} Đang theo dõi</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 100,
  },
  emailContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'opensans_bold',
    fontSize: 16,
    color: colors.PRIMARY,
  },
  email: {
    fontFamily: 'opensans_regular',
    fontSize: 13,
    color: colors.CONTRAST,
  },
  followContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  follow: {
    backgroundColor: colors.PRIMARY,
    color: colors.CONTRAST,
    fontSize: 13,
    marginRight: 10,
    padding: 6,
    borderRadius: 10,
  },
  verify: {
    color: colors.PRIMARY,
    fontSize: 13,
    marginLeft: 5,
  },
});

export default ProfileSection;
