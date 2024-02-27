import {Provider} from 'react-redux';
import store from 'src/store';
import AppNavigator from 'src/navigation/Index';
import {clearDataOfAsyncStorage} from '@utils/asyncStorage';
import Toast from 'react-native-toast-message';
import {QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();

const App = () => {
  clearDataOfAsyncStorage();
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppNavigator />
        <Toast topOffset={20} />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
