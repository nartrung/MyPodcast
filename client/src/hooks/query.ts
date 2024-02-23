import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useQuery} from 'react-query';
import {categoriesTypes} from '@utils/categories';

interface AudioData {
  id: string;
  title: string;
  about: string;
  category: categoriesTypes;
  file: string;
  poster: string | undefined;
  owner: {
    name: string;
    id: string;
  };
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
