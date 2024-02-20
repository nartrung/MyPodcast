import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPassword from '@views/auth/ForgotPassword';
import LogIn from '@views/auth/LogIn';
import SignUp from '@views/auth/SignUp';
import PasswordVerification from '@views/auth/PasswordVerification';
import {AuthStackNavigitionScreen} from 'src/@type/navigation';
import EmailVerification from '@views/auth/EmailVerification';
import ResetPassword from '@views/auth/ResetPassword';

const Stack = createNativeStackNavigator<AuthStackNavigitionScreen>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LogIn" component={LogIn}></Stack.Screen>
      <Stack.Screen name="SignUp" component={SignUp}></Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}></Stack.Screen>
      <Stack.Screen
        name="PasswordVerification"
        component={PasswordVerification}></Stack.Screen>
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerification}></Stack.Screen>
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
