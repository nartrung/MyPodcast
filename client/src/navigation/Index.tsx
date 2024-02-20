import {NavigationContainer} from '@react-navigation/native';
import {FC} from 'react';
import AuthNavigator from './AuthNavigator';
import {useSelector} from 'react-redux';
import {RootState} from 'src/store';
import {getAuthState} from 'src/store/auth';
import TabNavigator from './TabNavigator';

interface Props {}

const AppNavigator: FC<Props> = props => {
  const loggedIn = useSelector(
    (rootState: RootState) => getAuthState(rootState).loggedIn,
  );
  return (
    <NavigationContainer>
      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
