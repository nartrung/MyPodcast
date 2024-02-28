import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';
import {AudioData} from 'src/hooks/query';

interface Player {
  onGoingAudio: AudioData | null;
}

const initialState: Player = {
  onGoingAudio: null,
};

const slice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    updateOnGoingAudio(
      playerState,
      {payload}: PayloadAction<AudioData | null>,
    ) {
      playerState.onGoingAudio = payload;
    },
  },
});

export const {updateOnGoingAudio} = slice.actions;

export const getPlayerState = (state: RootState) => state.player;

export default slice.reducer;
