import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './auth';
import playerReducer from './player';

const reducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
