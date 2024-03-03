import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import {FC, useState} from 'react';
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
import OptionsModal from './OptionsModal';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {Playlist} from 'src/@type/playlist';
import CreatePlaylistModal from './CreatePlaylistModal';
import {FetchPlaylist} from 'src/hooks/query';
import PlaylistModal from './PlaylistModal';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const fmDuration = (duration = 0) => {
  return formatDuration(duration);
};

const AudioPlayer: FC<Props> = ({visible, onRequestClose}) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showCreatePlaylists, setShowCreatePlaylists] = useState(false);
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
  const {data} = FetchPlaylist();

  const handleAddFav = async () => {
    if (!onGoingAudio) return;
    const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
    try {
      const {data} = await axios.post(
        'http://10.0.2.2:8080/favorite?audioId=' + onGoingAudio.id,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (data) {
        Toast.show({
          type: 'success',
          text1: 'Đã thêm vào yêu thích',
        });
      }
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra',
      });
    }
    setShowOptions(false);
  };

  const handleAddPlaylist = () => {
    setShowOptions(false);
    setShowPlaylists(true);
  };

  const handleSubmitCreatePlaylist = async (value: string) => {
    if (value) {
      const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
      try {
        await axios.post(
          'http://10.0.2.2:8080/playlist/create',
          {
            title: value,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        );
        Toast.show({
          type: 'success',
          text1: 'Tạo playlist thành công',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Đã có lỗi xảy ra! Vui lòng thử lại.',
        });
      }
      setShowCreatePlaylists(false);
      setShowPlaylists(true);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Vui lòng nhập tên Playlist',
      });
    }
  };

  const handleUpdatePlaylist = async (item: Playlist) => {
    const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
    try {
      const url =
        'http://10.0.2.2:8080/playlist/update?playlistId=' +
        item.id +
        '&audioId=' +
        onGoingAudio?.id;

      await axios.patch(url, null, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setShowPlaylists(false);
      Toast.show({
        type: 'success',
        text1: 'Thêm vào Playlist ' + item.title + ' thành công',
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra! Vui lòng thử lại.',
      });
    }
  };
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
  const [showOptions, setShowOptions] = useState(false);

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
          }}
        />
        <OptionsModal
          visible={showOptions}
          onRequestClose={() => {
            setShowOptions(false);
          }}
          options={[
            {
              title: 'Thêm vào Danh sách yêu thích',
              icon: 'cards-heart-outline',
              onPress: handleAddFav,
            },
            {
              title: 'Thêm vào Playlist',
              icon: 'playlist-music',
              onPress: handleAddPlaylist,
            },
          ]}
          poster={onGoingAudio?.poster}
          title={onGoingAudio?.title}
          renderItem={item => {
            return (
              <Pressable onPress={item.onPress} style={styles.options}>
                <MaterialComIcons name={item.icon} style={styles.optionsIcon} />
                <Text style={styles.optionsTitle}>{item.title}</Text>
              </Pressable>
            );
          }}
        />
        <PlaylistModal
          onAddToPlaylistPress={handleUpdatePlaylist}
          onCreatePlaylistPress={() => {
            setShowCreatePlaylists(true);
            setShowPlaylists(false);
          }}
          visible={showPlaylists}
          onRequestClose={() => {
            setShowPlaylists(false);
            setShowOptions(true);
          }}
          list={data || []}
        />
        <CreatePlaylistModal
          visible={showCreatePlaylists}
          onRequestClose={() => {
            setShowCreatePlaylists(false);
            setShowPlaylists(true);
          }}
          onSubmitCreatePlaylist={handleSubmitCreatePlaylist}
        />
        <View style={{alignItems: 'center'}}>
          <Image source={source} style={styles.poster} />
        </View>
        <View style={styles.contentContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {onGoingAudio?.title}
          </Text>
          <View style={{marginLeft: 18}}>
            <AppLink title={onGoingAudio?.owner || ''}></AppLink>
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
    top: 10,
    left: 15,
  },
  addToList: {
    position: 'absolute',
    top: 10,
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
