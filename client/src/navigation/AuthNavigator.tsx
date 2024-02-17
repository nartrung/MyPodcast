import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPassword from '@views/auth/ForgotPassword';
import LogIn from '@views/auth/LogIn';
import SignUp from '@views/auth/SignUp';
import Verification from '@views/auth/Verification';
import {AuthStackNavigitionScreen} from 'src/@type/navigation';

const Stack = createNativeStackNavigator<AuthStackNavigitionScreen>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LogIn" component={LogIn}></Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUp}></Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}></Stack.Screen>
      <Stack.Screen name="Verification" component={Verification}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
