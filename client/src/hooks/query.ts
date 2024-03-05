import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useQuery} from 'react-query';
import {categoriesTypes} from '@utils/categories';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import {History, Playlist} from 'src/@type/playlist';
import {UserProfile} from 'src/store/auth';

export interface AudioData {
  id: string;
  title: string;
  about: string;
  category: categoriesTypes;
  file: string;
  poster: string | undefined;
  owner: string;
  verified?: boolean | undefined;
  ownerId: string;
}

const fetchLastestPodcast = async (): Promise<AudioData[]> => {
  const {data} = await axios.get('http://10.0.2.2:8080/audio/lastest');
  return data.audios;
};

export const FetchLastestPodcast = () => {
  return useQuery(['latest-podcast'], {
    queryFn: () => fetchLastestPodcast(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

const fetchRecentPlayPodcast = async (): Promise<AudioData[]> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get(
    'http://10.0.2.2:8080/history/recently-played',
    {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data;',
      },
    },
  );
  return data.audios;
};

export const FetchRecentPlayPodcast = () => {
  return useQuery(['recent-play'], {
    queryFn: () => fetchRecentPlayPodcast(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

const fetchRecommendPodcast = async (): Promise<AudioData[]> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get('http://10.0.2.2:8080/profile/recommended', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data;',
    },
  });
  return data.audios;
};

export const FetchRecommendPodcast = () => {
  return useQuery(['recommend-podcast'], {
    queryFn: () => fetchRecommendPodcast(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

const fetchPlaylists = async (): Promise<Playlist[]> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get('http://10.0.2.2:8080/playlist', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data;',
    },
  });
  return data.playlist;
};

export const FetchPlaylist = () => {
  return useQuery(['playlists'], {
    queryFn: () => fetchPlaylists(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

const fetchUploadedPodcast = async (): Promise<AudioData[]> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get(
    'http://10.0.2.2:8080/profile/all-uploads?pageNo=1',
    {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data;',
      },
    },
  );
  return data.audios;
};

export const FetchUploadedPodcast = () => {
  return useQuery(['uploaded-podcast'], {
    queryFn: () => fetchUploadedPodcast(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

const fetchFavoritesPodcast = async (): Promise<AudioData[]> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get('http://10.0.2.2:8080/favorite/', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data;',
    },
  });
  return data.audios;
};

export const FetchFavoritesPodcast = () => {
  return useQuery(['favorites-podcast'], {
    queryFn: () => fetchFavoritesPodcast(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

const fetchProfile = async (): Promise<UserProfile> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get('http://10.0.2.2:8080/auth/is-auth', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data;',
    },
  });
  return data.user;
};

export const FetchProfile = () => {
  return useQuery(['profile'], {
    queryFn: () => fetchProfile(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

const fetchHistories = async (): Promise<History[]> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get('http://10.0.2.2:8080/history/', {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data;',
    },
  });
  return data.histories;
};

export const FetchHistories = () => {
  return useQuery(['histories'], {
    queryFn: () => fetchHistories(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};

export const fetchIsFavorites = async (id: string): Promise<boolean> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get('http://10.0.2.2:8080/favorite/' + id, {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'multipart/form-data;',
    },
  });
  return data.favorite;
};

const fetchAutoPlaylist = async (): Promise<AudioData[]> => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  const {data} = await axios.get(
    'http://10.0.2.2:8080/profile/getAutoPlaylist',
    {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data;',
      },
    },
  );
  return data.finalList;
};

export const FetchAutoPlaylist = () => {
  return useQuery(['auto-playlist'], {
    queryFn: () => fetchAutoPlaylist(),
    onError(err) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi trong quá trình tải',
      });
    },
  });
};
