import {FC} from 'react';
import {View, StyleSheet, Text, Settings} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Favorites from './profile/Favorites';
import Playlists from './profile/Playlists';
import Uploads from './profile/Uploads';
import Histories from './profile/Histories';
import Setting from './profile/Setting';
import colors from '@utils/colors';
import {useSelector, shallowEqual} from 'react-redux';
import {getAuthState} from 'src/store/auth';
import {RootState} from 'src/store';

const Tab = createMaterialTopTabNavigator();

interface Props {}

const Profile: FC<Props> = props => {
  const profile = useSelector(
    (rootState: RootState) => getAuthState(rootState).profile,
    {
      equalityFn: shallowEqual,
    },
  );

  return (
    <View style={styles.container}>
      <View>
        <Text>{profile?.email}</Text>
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
                    fontSize: 12,
                    color: focused ? colors.PRIMARY : colors.CONTRAST,
                  }}>
                  {route.name}
                </Text>
              </View>
            );
          },
          tabBarIndicatorStyle: styles.indicator,
        })}>
        <Tab.Screen name="Yêu thích" component={Favorites} />
        <Tab.Screen name="Playlist" component={Playlists} />
        <Tab.Screen name="Đăng tải" component={Uploads} />
        <Tab.Screen name="Lịch sử" component={Histories} />
        <Tab.Screen name="Cài đặt" component={Setting} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: colors.BACKGROUND,
  },
  indicator: {
    backgroundColor: colors.PRIMARY,
  },
});

export default Profile;
