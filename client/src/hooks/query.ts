import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useQuery} from 'react-query';
import {categoriesTypes} from '@utils/categories';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';

interface AudioData {
  id: string;
  title: string;
  about: string;
  category: categoriesTypes;
  file: string;
  poster: string | undefined;
  owner: string;
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
