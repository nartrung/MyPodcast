import {FC} from 'react';
import {View, StyleSheet, Animated, ActivityIndicator} from 'react-native';

interface Props {}

const Loader: FC<Props> = props => {
  return <ActivityIndicator size={30} color="white"></ActivityIndicator>;
};

export default Loader;
