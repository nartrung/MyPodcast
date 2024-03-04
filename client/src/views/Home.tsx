import {FC, useState, createContext, useContext} from 'react';
import {StyleSheet, Text, Image, ScrollView, Pressable} from 'react-native';
import LastestPodcast from '@components/LastestPodcast';
import colors from '@utils/colors';
import RecommendPodcast from '@components/RecommendPodcast';
import OptionsModal from '@components/OptionsModal';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AudioData, FetchPlaylist} from 'src/hooks/query';
import axios from 'axios';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import Toast from 'react-native-toast-message';
import PlaylistModal from '@components/PlaylistModal';
import CreatePlaylistModal from '@components/CreatePlaylistModal';
import {Playlist} from 'src/@type/playlist';
import audioController from 'src/hooks/audioController';
import AppView from '@components/AppView';

interface Props {}

export const PlayerContext = createContext({
  setShowOptions: (show: boolean) => {},
  setSelectedPodcast: (selected: AudioData) => {},
});
const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [showCreatePlaylists, setShowCreatePlaylists] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<AudioData>();
  const {audioPress} = audioController();
  const {data} = FetchPlaylist();

  const handleAddFav = async () => {
    if (!selectedPodcast) return;
    const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
    try {
      const {data} = await axios.post(
        'http://10.0.2.2:8080/favorite?audioId=' + selectedPodcast.id,
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
    setSelectedPodcast(undefined);
    setShowOptions(false);
  };

  const handleAddPlaylist = () => {
    setShowPlaylists(true);
    setShowOptions(false);
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
        selectedPodcast?.id;

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

  return (
    <PlayerContext.Provider
      value={{
        setShowOptions: (show: boolean) => setShowOptions(show),
        setSelectedPodcast: (selected: AudioData) =>
          setSelectedPodcast(selected),
      }}>
      <AppView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ScrollView
            scrollEnabled={false}
            style={styles.heading}
            horizontal
            showsHorizontalScrollIndicator={false}>
            <Image
              style={styles.headingImage}
              source={require('../assets/images/DummyAvatar.png')}
            />
            <Text style={styles.headingTitle}>Nghe ngay</Text>
          </ScrollView>
          <LastestPodcast
            onPodcastLongPress={item => {
              setShowOptions(true);
              setSelectedPodcast(item);
            }}
            onPodcastPress={audioPress}
          />
          <RecommendPodcast
            onPodcastLongPress={item => {
              setShowOptions(true);
              setSelectedPodcast(item);
            }}
            onPodcastPress={audioPress}
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
            poster={selectedPodcast?.poster}
            title={selectedPodcast?.title}
            renderItem={item => {
              return (
                <Pressable onPress={item.onPress} style={styles.options}>
                  <MaterialComIcons
                    name={item.icon}
                    style={styles.optionsIcon}
                  />
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
        </ScrollView>
      </AppView>
    </PlayerContext.Provider>
  );
};

const styles = StyleSheet.create({
  heading: {
    height: 60,
  },
  headingImage: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
    marginLeft: 24,
    marginTop: 10,
  },
  headingTitle: {
    color: colors.PRIMARY,
    fontSize: 32,
    fontFamily: 'opensans_bold',
    marginLeft: 12,
    marginTop: 10,
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

export default Home;
