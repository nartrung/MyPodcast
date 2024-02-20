import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '@views/Home';
import Profile from '@views/Profile';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
