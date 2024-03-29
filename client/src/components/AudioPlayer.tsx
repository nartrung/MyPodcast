import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import {FC, useContext, useState} from 'react';
import {View, StyleSheet, Image, Text, Pressable} from 'react-native';
import {useProgress} from 'react-native-track-player';
import {useSelector} from 'react-redux';
import {RootState} from 'src/store';
import {getPlayerState} from 'src/store/player';
import formatDuration from 'format-duration';
import Slider from '@react-native-community/slider';
import audioController from 'src/hooks/audioController';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import PlayPauseIcon from '@ui/PlayPauseIcon';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import PlayerControllerIcon from '@ui/PlayerControllerIcon';
import Loader from '@ui/Loader';
import AudioInfoContainer from './AudioInfoContainer';
import {PlayerContext} from '@views/Home';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onProfilePress(): void;
}

const fmDuration = (duration = 0) => {
  return formatDuration(duration);
};

const AudioPlayer: FC<Props> = ({visible, onRequestClose, onProfilePress}) => {
  const {setShowOptions, setSelectedPodcast} = useContext(PlayerContext);
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const onGoingAudio = useSelector(
    (rootState: RootState) => getPlayerState(rootState).onGoingAudio,
  );
  const {
    seekPositionTo,
    togglePlayPause,
    skipTo,
    skipToNext,
    skipToPrevious,
    isPlaying,
    isBusy,
  } = audioController();
  const poster = onGoingAudio?.poster;
  const source = poster
    ? {uri: poster}
    : require('../assets/images/DummyPoster.png');
  const {duration, position} = useProgress();

  const updateSeek = async (value: number) => {
    await seekPositionTo(value);
  };

  const handleSkip = async (sec: number) => {
    await skipTo(sec);
  };

  const handleSkipToNext = async () => {
    await skipToNext();
  };
  const handleSkipToPrevious = async () => {
    await skipToPrevious();
  };

  if (showAudioInfo)
    return (
      <AppModal animation visible={visible} onRequestClose={onRequestClose}>
        <View>
          <AudioInfoContainer
            visible={showAudioInfo}
            closeHandler={setShowAudioInfo}
          />
        </View>
      </AppModal>
    );
  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <AntDesign
          name="infocirlceo"
          size={24}
          style={styles.info}
          color={colors.CONTRAST}
          onPress={() => setShowAudioInfo(true)}
        />
        <Entypo
          name="add-to-list"
          size={24}
          style={styles.addToList}
          color={colors.CONTRAST}
          onPress={() => {
            setShowOptions(true);
            setSelectedPodcast(onGoingAudio!);
          }}
        />

        <View style={{alignItems: 'center'}}>
          <Image source={source} style={styles.poster} />
        </View>
        <View style={styles.contentContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {onGoingAudio?.title}
          </Text>
          <View style={{marginLeft: 18}}>
            <AppLink
              onPress={onProfilePress}
              title={onGoingAudio?.owner || ''}></AppLink>
          </View>
          <Slider
            style={{marginTop: 15}}
            minimumValue={0}
            maximumValue={duration}
            thumbTintColor={colors.PRIMARY}
            minimumTrackTintColor={colors.PRIMARY}
            maximumTrackTintColor={colors.CONTRAST}
            value={position}
            onSlidingComplete={updateSeek}
          />
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>{fmDuration(position * 1000)}</Text>
            <Text style={styles.duration}>{fmDuration(duration * 1000)}</Text>
          </View>
        </View>
        <View style={styles.controller}>
          <PlayerControllerIcon onPress={() => handleSkipToPrevious()}>
            <AntDesign style={styles.icon} name="stepbackward" size={32} />
          </PlayerControllerIcon>
          <PlayerControllerIcon onPress={() => handleSkip(-10)}>
            <FontAwesome6Icon
              style={styles.icon}
              name="rotate-left"
              size={28}
            />
          </PlayerControllerIcon>
          {isBusy ? (
            <Loader color={colors.CONTRAST} />
          ) : (
            <PlayPauseIcon
              color={colors.CONTRAST}
              playing={isPlaying}
              onPress={togglePlayPause}
            />
          )}
          <PlayerControllerIcon onPress={() => handleSkip(10)}>
            <FontAwesome6Icon
              style={styles.icon}
              name="rotate-right"
              size={28}
            />
          </PlayerControllerIcon>
          <PlayerControllerIcon onPress={() => handleSkipToNext()}>
            <AntDesign style={styles.icon} name="stepforward" size={32} />
          </PlayerControllerIcon>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.THIRD,
  },
  info: {
    position: 'absolute',
    top: 50,
    left: 15,
  },
  addToList: {
    position: 'absolute',
    top: 50,
    right: 15,
  },
  contentContainer: {
    width: '100%',
  },
  title: {
    fontFamily: 'opensans_bold',
    fontSize: 18,
    color: colors.CONTRAST,
    marginLeft: 18,
  },
  poster: {
    marginVertical: 40,
    width: 225,
    height: 225,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: colors.SECONDARY,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '91%',
    marginHorizontal: 18,
  },
  duration: {
    fontFamily: 'opensans_bold',
    color: colors.PRIMARY,
  },
  controller: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  icon: {
    color: colors.CONTRAST,
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionsIcon: {
    fontSize: 24,
    color: colors.PRIMARY,
    paddingHorizontal: 11,
  },
  optionsTitle: {
    fontFamily: 'opensans_regular',
    fontSize: 18,
  },
});

export default AudioPlayer;
