import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import {AudioData} from './query';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store';
import {
  getPlayerState,
  updateOnGoingAudio,
  updateOnGoingList,
} from 'src/store/player';
import deepEqual from 'deep-equal';

const updateQueue = async (data: AudioData[]) => {
  const list: Track[] = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      url: item.file,
      artist: item.owner,
      artwork: item.poster || require('../assets/images/DummyPoster.png'),
      genre: item.category,
      isLiveStream: true,
    };
  });
  await TrackPlayer.add([...list]);
};

const audioController = () => {
  const {state: playbackState} = usePlaybackState() as {state?: State};
  const onGoingAudio = useSelector(
    (rootState: RootState) => getPlayerState(rootState).onGoingAudio,
  );
  const onGoingList = useSelector(
    (rootState: RootState) => getPlayerState(rootState).onGoingList,
  );
  const dispatch = useDispatch();
  const isPlayerReady =
    playbackState !== State.None && playbackState != undefined;
  const isPlaying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const isBusy =
    playbackState === State.Buffering || playbackState === State.Loading;

  const audioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPlayerReady) {
      await updateQueue(data);
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
      return dispatch(updateOnGoingList(data));
    }
    if (isPlaying && onGoingAudio?.id === item.id) {
      await TrackPlayer.reset();
      await updateQueue(data);
      dispatch(updateOnGoingList(data));
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      return await TrackPlayer.play();
    }
    if (isPaused && onGoingAudio?.id === item.id) {
      return await TrackPlayer.play();
    }
    if (onGoingAudio?.id !== item.id) {
      const isSameList = deepEqual(onGoingList, data);
      await TrackPlayer.pause();
      const index = data.findIndex(audio => audio.id === item.id);

      if (!isSameList) {
        await TrackPlayer.reset();
        await updateQueue(data);
        dispatch(updateOnGoingList(data));
      }

      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      return dispatch(updateOnGoingAudio(item));
    }
  };

  const togglePlayPause = async () => {
    if (isPlaying) return await TrackPlayer.pause();
    if (isPaused || isPlayerReady) return await TrackPlayer.play();
  };

  const seekPositionTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (sec: number) => {
    const currentPosition = await TrackPlayer.getProgress().then(
      progress => progress.position,
    );
    await TrackPlayer.seekTo(currentPosition + sec);
  };

  const skipToNext = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (currentIndex === undefined) return;
    const nextIndex = currentIndex + 1;
    const nextAudio = currentList[nextIndex];
    if (nextAudio) {
      await TrackPlayer.skipToNext();
      dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
    }
  };
  const skipToPrevious = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getActiveTrackIndex();
    if (currentIndex === undefined) return;
    const nextIndex = currentIndex - 1;
    const nextAudio = currentList[nextIndex];
    if (nextAudio) {
      await TrackPlayer.skipToPrevious();
      dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
    }
  };
  return {
    audioPress,
    togglePlayPause,
    seekPositionTo,
    skipTo,
    skipToNext,
    skipToPrevious,
    isPlayerReady,
    isPlaying,
    isBusy,
  };
};

export default audioController;
