import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from 'src/store';
import AuthNavigator from 'src/navigation/AuthNavigator';
import AppNavigator from 'src/navigation/Index';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
};

export default App;
