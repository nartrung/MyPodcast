import {FC, ReactNode} from 'react';
import {Pressable} from 'react-native';

interface Props {
  size?: number;
  children: ReactNode;
  onPress?(): void;
}

const PlayerControllerIcon: FC<Props> = ({size = 48, children, onPress}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {children}
    </Pressable>
  );
};

export default PlayerControllerIcon;
