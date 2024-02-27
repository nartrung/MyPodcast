import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToAsyncStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const getDataFromAsyncStorage = async (key: string) => {
  return await AsyncStorage.getItem(key);
};

export const removeDataFromAsyncStorage = async (key: string) => {
  return await AsyncStorage.removeItem(key);
};

export const clearDataOfAsyncStorage = async () => {
  await AsyncStorage.clear();
};

export enum keys {
  AUTH_TOKEN = 'AUTH_TOKEN',
}
