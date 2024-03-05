import {FC, useState, createContext, useContext} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Pressable,
  View,
  RefreshControl,
} from 'react-native';
import LastestAndRecentPodcast from '@components/LastestAndRecentPodcast';
import colors from '@utils/colors';
import RecommendPodcast from '@components/RecommendPodcast';
import OptionsModal from '@components/OptionsModal';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AudioData,
  FetchPlaylist,
  FetchRecommendPodcast,
  fetchIsFavorites,
} from 'src/hooks/query';
import axios from 'axios';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import Toast from 'react-native-toast-message';
import PlaylistModal from '@components/PlaylistModal';
import CreatePlaylistModal from '@components/CreatePlaylistModal';
import {Playlist} from 'src/@type/playlist';
import audioController from 'src/hooks/audioController';
import AppView from '@components/AppView';
import {useQuery, useQueryClient} from 'react-query';
import AutoPlaylist from '@components/AutoPlaylist';

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
  const {data: playlist} = FetchPlaylist();
  const {isFetching} = FetchRecommendPodcast();
  const PodcastID = selectedPodcast?.id;
  const {data: favorite, refetch} = useQuery(['is-favorite', PodcastID], {
    queryFn: () => fetchIsFavorites(PodcastID || ''),
    enabled: !!PodcastID,
  });
  const queryClient = useQueryClient();

  let favTitle = 'Thêm vào Danh sách yêu thích';
  let favIcon = 'cards-heart-outline';

  const handleLongPress = (item: AudioData) => {
    setSelectedPodcast(item);
    refetch;
    setShowOptions(true);
  };
  if (favorite) {
    favTitle = 'Xóa khỏi Danh sách yêu thích';
    favIcon = 'cards-heart';
  }
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
      queryClient.invalidateQueries({queryKey: ['favorites-podcast']});
      if (data.status === 'liked') {
        Toast.show({
          type: 'success',
          text1: 'Đã thêm vào yêu thích',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Đã xóa khỏi yêu thích',
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
        queryClient.invalidateQueries({queryKey: ['playlists']});
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
      queryClient.invalidateQueries({queryKey: ['playlists']});
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
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {
                queryClient.invalidateQueries({
                  queryKey: ['recommend-podcast'],
                });
                queryClient.invalidateQueries({
                  queryKey: ['lastest-podcast'],
                });
                queryClient.invalidateQueries({
                  queryKey: ['recent-play'],
                });
                queryClient.invalidateQueries({
                  queryKey: ['auto-playlist'],
                });
              }}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={styles.heading}>
            <Image
              style={styles.headingImage}
              source={require('../assets/images/MyPodcastLogo.png')}
            />
            <Text style={styles.headingTitle}>Nghe ngay</Text>
          </View>
          <LastestAndRecentPodcast
            onPodcastLongPress={handleLongPress}
            onPodcastPress={audioPress}
          />
          <RecommendPodcast
            onPodcastLongPress={handleLongPress}
            onPodcastPress={audioPress}
          />
          <OptionsModal
            visible={showOptions}
            onRequestClose={() => {
              setShowOptions(false);
            }}
            options={[
              {
                title: favTitle,
                icon: favIcon,
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
            list={playlist || []}
          />
          <CreatePlaylistModal
            visible={showCreatePlaylists}
            onRequestClose={() => {
              setShowCreatePlaylists(false);
              setShowPlaylists(true);
            }}
            onSubmitCreatePlaylist={handleSubmitCreatePlaylist}
          />
          <AutoPlaylist />
        </ScrollView>
      </AppView>
    </PlayerContext.Provider>
  );
};

const styles = StyleSheet.create({
  heading: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headingImage: {
    height: 40,
    width: 40,
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
