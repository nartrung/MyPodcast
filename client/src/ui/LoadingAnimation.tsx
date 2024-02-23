import {FC, ReactNode, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  children: ReactNode;
}

const LoadingAnimation: FC<Props> = ({children}) => {
  const opacitySharedValue = useSharedValue(1);
  const opacity = useAnimatedStyle(() => {
    return {
      opacity: opacitySharedValue.value,
    };
  });

  useEffect(() => {
    opacitySharedValue.value = withRepeat(
      withTiming(0.1, {
        duration: 600,
      }),
      -1,
      true,
    );
  });
  return <Animated.View style={opacity}>{children}</Animated.View>;
};

export default LoadingAnimation;
