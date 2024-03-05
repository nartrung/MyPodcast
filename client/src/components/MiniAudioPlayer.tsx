import Loader from '@ui/Loader';
import PlayPauseIcon from '@ui/PlayPauseIcon';
import colors from '@utils/colors';
import {mapRange} from '@utils/math';
import {FC, useState} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import {useProgress} from 'react-native-track-player';
import {useSelector} from 'react-redux';
import audioController from 'src/hooks/audioController';
import {RootState} from 'src/store';
import {getPlayerState} from 'src/store/player';
import AudioPlayer from './AudioPlayer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {HomeStackNavigitionScreen} from 'src/@type/navigation';

interface Props {}

export const MiniPlayerHeight = 50;

const MiniAudioPlayer: FC<Props> = props => {
  const onGoingAudio = useSelector(
    (rootState: RootState) => getPlayerState(rootState).onGoingAudio,
  );
  const {isPlaying, togglePlayPause, isBusy} = audioController();
  const progress = useProgress();
  const poster = onGoingAudio?.poster;
  const source = poster
    ? {uri: poster}
    : require('../assets/images/DummyPoster.png');

  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const navigation = useNavigation<NavigationProp<HomeStackNavigitionScreen>>();
  const closeAudioPlayer = () => {
    setShowAudioPlayer(false);
  };
  const openAudioPlayer = () => {
    setShowAudioPlayer(true);
  };
  const handleProfilePress = () => {
    closeAudioPlayer();
    navigation.navigate('UserProfile', {
      userId: onGoingAudio?.ownerId || '',
    });
  };
  return (
    <>
      <View style={styles.container}>
        <Image source={source} style={styles.poster} />
        <Pressable onPress={openAudioPlayer} style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {onGoingAudio?.title}
          </Text>
          <Text style={styles.owner}>{onGoingAudio?.owner}</Text>
        </Pressable>
        {isBusy ? (
          <Loader />
        ) : (
          <PlayPauseIcon playing={isPlaying} onPress={togglePlayPause} />
        )}
      </View>
      <View style={{backgroundColor: colors.STROKE}}>
        <View
          style={{
            height: 3,
            backgroundColor: colors.CONTRAST,
            width: `${mapRange({
              outputMin: 0,
              outputMax: 100,
              inputMin: 0,
              inputMax: progress.duration,
              inputValue: progress.position,
            })}%`,
          }}
        />
      </View>
      <AudioPlayer
        visible={showAudioPlayer}
        onRequestClose={closeAudioPlayer}
        onProfilePress={handleProfilePress}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: MiniPlayerHeight,
    backgroundColor: colors.PRIMARY_OVERLAY,
    padding: 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
    color: colors.CONTRAST_OVERLAY,
    paddingHorizontal: 10,
  },
  owner: {
    fontFamily: 'opensans_bold',
    fontSize: 11,
    color: colors.CONTRAST_OVERLAY,
    paddingHorizontal: 10,
  },
});

export default MiniAudioPlayer;
