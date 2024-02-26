import {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '@views/Profile';
import EmailVerification from '@views/auth/EmailVerification';
import {ProfileStackNavigitionScreen} from 'src/@type/navigation';

const Stack = createNativeStackNavigator<ProfileStackNavigitionScreen>();

interface Props {}

const ProfileNavigator: FC<Props> = props => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ProfileNavigator;
