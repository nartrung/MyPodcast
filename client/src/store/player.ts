import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '.';
import {AudioData} from 'src/hooks/query';

interface Player {
  onGoingAudio: AudioData | null;
  onGoingList: AudioData[];
}

const initialState: Player = {
  onGoingAudio: null,
  onGoingList: [],
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
    updateOnGoingList(playerState, {payload}: PayloadAction<AudioData[]>) {
      playerState.onGoingList = payload;
    },
  },
});

export const {updateOnGoingAudio, updateOnGoingList} = slice.actions;

export const getPlayerState = (state: RootState) => state.player;

export default slice.reducer;
