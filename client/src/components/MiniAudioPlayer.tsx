import Loader from '@ui/Loader';
import PlayPauseIcon from '@ui/PlayPauseIcon';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import audioController from 'src/hooks/audioController';
import {RootState} from 'src/store';
import {getPlayerState} from 'src/store/player';

interface Props {}

export const MiniPlayerHeight = 50;

const MiniAudioPlayer: FC<Props> = props => {
  const onGoingAudio = useSelector(
    (rootState: RootState) => getPlayerState(rootState).onGoingAudio,
  );
  const {isPlaying, togglePlayPause, isBusy} = audioController();
  const poster = onGoingAudio?.poster;
  const source = poster
    ? {uri: poster}
    : require('../assets/images/DummyPoster.png');
  return (
    <View style={styles.container}>
      <Image source={source} style={styles.poster} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {onGoingAudio?.title}
        </Text>
        <Text style={styles.owner}>{onGoingAudio?.owner}</Text>
      </View>
      {isBusy ? (
        <Loader />
      ) : (
        <PlayPauseIcon playing={isPlaying} onPress={togglePlayPause} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '97%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY_OVERLAY,
    padding: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    height: '100%',
  },
  poster: {
    height: MiniPlayerHeight - 10,
    width: MiniPlayerHeight - 10,
    aspectRatio: 1,
    borderRadius: 8,
  },
  title: {
    fontFamily: 'opensans_bold',
    color: colors.CONTRAST,
    paddingHorizontal: 10,
  },
  owner: {
    fontFamily: 'opensans_bold',
    fontSize: 11,
    color: colors.CONTRAST,
    paddingHorizontal: 10,
  },
});

export default MiniAudioPlayer;
