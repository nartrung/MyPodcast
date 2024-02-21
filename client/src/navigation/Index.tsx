import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {FC, useEffect} from 'react';
import AuthNavigator from './AuthNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store';
import {
  getAuthState,
  updateBusyState,
  updateLogInState,
  updateProfile,
} from 'src/store/auth';
import TabNavigator from './TabNavigator';
import {
  clearDataOfAsyncStorage,
  getDataFromAsyncStorage,
  keys,
} from '@utils/asyncStorage';
import axios from 'axios';
import Loading from '@views/loading/Loading';
import colors from '@utils/colors';

interface Props {}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.BACKGROUND,
    primary: colors.SECONDARY,
  },
};

const AppNavigator: FC<Props> = props => {
  const loggedIn = useSelector(
    (rootState: RootState) => getAuthState(rootState).loggedIn,
  );

  const busy = useSelector(
    (rootState: RootState) => getAuthState(rootState).busy,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);

        if (!token) return dispatch(updateBusyState(false));
        const {data} = await axios.get('http://10.0.2.2:8080/auth/is-auth', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });
        dispatch(updateProfile(data.profile));
        dispatch(updateLogInState(true));
      } catch (error) {
        console.log(error);
      }
      dispatch(updateBusyState(false));
    };
    fetchAuthInfo();
  }, []);

  return (
    <NavigationContainer theme={AppTheme}>
      {busy ? <Loading /> : null}
      {!busy && loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
