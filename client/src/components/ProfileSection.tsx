import ProfileAvatarField from '@ui/ProfileAvatarField';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {UserProfile} from 'src/store/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Props {
  profile?: UserProfile | null;
}

const ProfileSection: FC<Props> = ({profile}) => {
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
          ) : null}
        </View>
        <View style={styles.container}>
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
  follow: {
    backgroundColor: colors.PRIMARY,
    color: colors.CONTRAST,
    fontSize: 13,
    marginRight: 10,
    padding: 6,
    borderRadius: 10,
  },
});

export default ProfileSection;
