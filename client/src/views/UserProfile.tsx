import AppView from '@components/AppView';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ProfileAvatarField from '@ui/ProfileAvatarField';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {HomeStackNavigitionScreen} from 'src/@type/navigation';
import {FetchUserProfile} from 'src/hooks/query';
import UserPublicUploads from './userProfile/UserPublicUploads';
import UserPublicPlaylist from './userProfile/UserPublicPlaylist';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationProp, useNavigation} from '@react-navigation/native';

type Props = NativeStackScreenProps<HomeStackNavigitionScreen, 'UserProfile'>;

const Tab = createMaterialTopTabNavigator();

const UserProfile: FC<Props> = ({route}) => {
  const {userId} = route.params;
  const {data} = FetchUserProfile(userId);
  const navigation = useNavigation<NavigationProp<HomeStackNavigitionScreen>>();
  if (!data) return null;

  return (
    <AppView>
      <View style={styles.container}>
        <Pressable
          style={styles.backIcon}
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Ionicons name="arrow-back-circle-outline" size={36} />
        </Pressable>
        <ProfileAvatarField source={data.avatar} />
        <View>
          <Text style={styles.name}>{data.name}</Text>
          <View style={styles.followContainer}>
            <Text style={styles.follower}>{data.followers} Người theo dõi</Text>
            <Pressable>
              <Text style={styles.follow}> Theo dõi + </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarLabel: ({focused}) => {
            return (
              <View
                style={{
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'opensans_bold',
                    fontSize: 16,
                    color: focused ? colors.PRIMARY : colors.CONTRAST,
                  }}>
                  {route.name}
                </Text>
              </View>
            );
          },
          tabBarIndicatorStyle: styles.indicator,
        })}>
        <Tab.Screen
          name="Đăng tải"
          component={UserPublicUploads}
          initialParams={{userId: userId}}
        />
        <Tab.Screen
          name="Playlist"
          component={UserPublicPlaylist}
          initialParams={{userId: userId}}
        />
      </Tab.Navigator>
    </AppView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  name: {
    fontFamily: 'opensans_bold',
    fontSize: 20,
    color: colors.PRIMARY,
    marginBottom: 5,
  },
  followContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  follower: {
    backgroundColor: colors.PRIMARY,
    borderWidth: 1,
    borderColor: colors.PRIMARY,
    color: colors.CONTRAST,
    fontSize: 13,
    marginRight: 10,
    padding: 5,
    borderRadius: 3,
  },
  follow: {
    borderColor: colors.CONTRAST,
    borderWidth: 1,
    fontFamily: 'opensans_bold',
    color: colors.CONTRAST,
    fontSize: 13,
    marginRight: 10,
    padding: 1,
    borderRadius: 3,
  },
  tabbar: {
    backgroundColor: colors.BACKGROUND,
  },
  indicator: {
    backgroundColor: colors.PRIMARY,
  },
  backIcon: {
    position: 'absolute',
    top: 16,
    left: 10,
  },
});

export default UserProfile;
