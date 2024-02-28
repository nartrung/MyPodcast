import TrackPlayer, {
  Track,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import {AudioData} from './query';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'src/store';
import {getPlayerState, updateOnGoingAudio} from 'src/store/player';

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
  const dispatch = useDispatch();
  const isPlayerReady = playbackState !== State.None;
  const isPalying = playbackState === State.Playing;
  const isPaused = playbackState === State.Paused;
  const audioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPlayerReady) {
      await updateQueue(data);
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
    }
    if (isPalying && onGoingAudio?.id === item.id) {
      await TrackPlayer.pause();
    }
    if (isPaused && onGoingAudio?.id === item.id) {
      await TrackPlayer.play();
    }
  };
  return {audioPress};
};

export default audioController;
