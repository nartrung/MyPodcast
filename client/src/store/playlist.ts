import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';

interface Playlist {
  visible: boolean;
  selectedPlaylistId?: string;
}

const initialState: Playlist = {
  visible: false,
};

const slice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    updatePlaylistVisibility(playlistState, {payload}: PayloadAction<boolean>) {
      playlistState.visible = payload;
    },
    updateSelectedPlaylistId(playlistState, {payload}: PayloadAction<string>) {
      playlistState.selectedPlaylistId = payload;
    },
  },
});

export const {updatePlaylistVisibility, updateSelectedPlaylistId} =
  slice.actions;

export const getPlaylistState = (state: RootState) => state.playlist;

export default slice.reducer;
