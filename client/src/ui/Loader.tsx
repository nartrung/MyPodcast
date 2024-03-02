import {FC} from 'react';
import {ActivityIndicator} from 'react-native';

interface Props {
  color?: string;
}

const Loader: FC<Props> = ({color = '#d9d9d9'}) => {
  return <ActivityIndicator size={24} color={color}></ActivityIndicator>;
};

export default Loader;
