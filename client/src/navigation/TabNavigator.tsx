import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import colors from '@utils/colors';
import Home from '@views/Home';
import ProfileNavigator from './ProfileNavigator';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Upload from '@views/Upload';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.SECONDARY,
          height: 60,
        },
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={24}
                color={colors.PRIMARY}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <FontAwesome
                name={focused ? 'user' : 'user-o'}
                size={24}
                color={colors.PRIMARY}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialComIcons
                name={focused ? 'account-music' : 'account-music-outline'}
                size={24}
                color={colors.PRIMARY}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
