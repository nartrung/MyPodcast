import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import axios from 'axios';
import TrackPlayer, {Event} from 'react-native-track-player';

interface HistoryAudio {
  audio: string;
  progress: number;
}

let timeoutId: NodeJS.Timeout;
const debounce = (func: Function, delay: number) => {
  return (...agrs: any) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, agrs);
    }, delay);
  };
};

const sendHistory = async (historyAudio: HistoryAudio) => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);

  await axios
    .post(
      'http://10.0.2.2:8080/history',
      {
        ...historyAudio,
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )
    .catch(err => {
      console.log(err);
    });
};

const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async event => {
    const list = await TrackPlayer.getQueue();
    const audio = list[event.track];
    const historyAudio = {
      audioId: audio.id,
      progress: event.position,
    };
    const debounceHistory = debounce(sendHistory, 200);
    debounceHistory(historyAudio);
  });
};

export default playbackService;
