import {FC, ReactNode} from 'react';
import {View, StyleSheet} from 'react-native';
import MiniAudioPlayer from './MiniAudioPlayer';
import audioController from 'src/hooks/audioController';
import PlayListAudioModal from './PlayListAudioModal';

interface Props {
  children: ReactNode;
}

const AppView: FC<Props> = ({children}) => {
  const {isPlayerReady} = audioController();
  return (
    <View style={styles.container}>
      <View style={styles.children}>{children}</View>
      <View style={{marginHorizontal: 5}}>
        {isPlayerReady && <MiniAudioPlayer />}
        <PlayListAudioModal />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  children: {
    flex: 1,
  },
});

export default AppView;
