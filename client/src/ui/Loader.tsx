import {FC} from 'react';
import {ActivityIndicator} from 'react-native';

interface Props {}

const Loader: FC<Props> = props => {
  return <ActivityIndicator size={24} color="#d9d9d9"></ActivityIndicator>;
};

export default Loader;
