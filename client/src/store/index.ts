import {combineReducers, configureStore} from '@reduxjs/toolkit';
import authReducer from './auth';
import playerReducer from './player';
import playlistReducer from './playlist';

const reducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
  playlist: playlistReducer,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
