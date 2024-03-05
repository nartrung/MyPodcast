import {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackNavigitionScreen} from 'src/@type/navigation';
import Home from '@views/Home';
import UserProfile from '@views/UserProfile';

const Stack = createNativeStackNavigator<HomeStackNavigitionScreen>();

interface Props {}

const HomeNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default HomeNavigator;
