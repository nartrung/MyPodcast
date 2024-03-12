import OptionsModal from '@components/OptionsModal';
import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import PlaylistItem from '@ui/PlaylistItem';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@type/playlist';
import {FetchPlaylist} from 'src/hooks/query';
import {
  updatePlaylistVisibility,
  updateSelectedPlaylistId,
  updateAllowRemovePlaylistId,
} from 'src/store/playlist';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import UpdatePlaylistInfoModal from '@components/UpdatePlaylistInfoModal';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useQueryClient} from 'react-query';
import CreatePlaylistModal from '@components/CreatePlaylistModal';

interface Props {}

const Playlists: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdatePlaylistModal, setShowUpdatePlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();
  const [showCreatePlaylists, setShowCreatePlaylists] = useState(false);

  const {data, isLoading} = FetchPlaylist();
  const dispatch = useDispatch();
  const handleOnPlaylistPress = (playlist: Playlist) => {
    dispatch(updateAllowRemovePlaylistId(true));
    dispatch(updateSelectedPlaylistId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };
  const handleOnPlaylistLongPress = (playlist: Playlist) => {
    setShowOptions(true);
    setSelectedPlaylist(playlist);
  };
  const handleUpdatePlaylist = () => {
    setShowOptions(false);
    setShowUpdatePlaylistModal(true);
  };
  const queryClient = useQueryClient();
  const handleSubmitUpdate = async (title: string, isPrivate: boolean) => {
    const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
    try {
      const url =
        'http://10.0.2.2:8080/playlist/update?playlistId=' +
        selectedPlaylist!.id;

      await axios.patch(
        url,
        {
          title: title,
          visibility: isPrivate ? 'private' : 'public',
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      setShowUpdatePlaylistModal(false);
      Toast.show({
        type: 'success',
        text1: 'Cập nhật thành công',
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
  const handleSubmitDelete = async () => {
    const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
    try {
      const url =
        'http://10.0.2.2:8080/playlist/delete?playlistId=' +
        selectedPlaylist!.id;
      await axios.delete(url, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });
      setShowOptions(false);
      Toast.show({
        type: 'success',
        text1: 'Đã xóa thành công',
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
    } else {
      Toast.show({
        type: 'info',
        text1: 'Vui lòng nhập tên Playlist',
      });
    }
  };
  const handleDeltePlaylist = () => {
    Alert.alert(
      'Xóa Danh sách phát',
      'Bạn có chắc muốn xóa Danh sách phát ' +
        selectedPlaylist?.title +
        '?. Điều này sẽ không thể hoàn tác',
      [
        {text: 'Hủy'},
        {
          text: 'Xóa',
          onPress: () => {
            handleSubmitDelete();
          },
        },
      ],
    );
  };
  if (isLoading)
    return (
      <LoadingAnimation>
        <AudioLoadingUI />
      </LoadingAnimation>
    );
  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              queryClient.invalidateQueries({queryKey: ['playlists']});
            }}
          />
        }>
        <Text style={styles.sectionTitle}>Danh sách phát của tôi</Text>
        {data?.map(playlist => {
          return (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              onPlaylistPress={() => handleOnPlaylistPress(playlist)}
              onPlaylistLongPress={() => handleOnPlaylistLongPress(playlist)}
            />
          );
        })}
      </ScrollView>
      <Pressable
        style={styles.addBtn}
        onPress={() => setShowCreatePlaylists(true)}>
        <MaterialIcon name="add" size={42} color={colors.SECONDARY} />
      </Pressable>
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(false);
        }}
        options={[
          {
            title: 'Cập nhật thông tin',
            icon: 'playlist-edit',
            onPress: handleUpdatePlaylist,
          },
          {
            title: 'Xóa danh sách phát',
            icon: 'delete',
            onPress: handleDeltePlaylist,
          },
        ]}
        title={selectedPlaylist?.title}
        renderItem={item => {
          return (
            <Pressable onPress={item.onPress} style={styles.options}>
              <MaterialComIcons name={item.icon} style={styles.optionsIcon} />
              <Text style={styles.optionsTitle}>{item.title}</Text>
            </Pressable>
          );
        }}
      />
      <UpdatePlaylistInfoModal
        visible={showUpdatePlaylistModal}
        onRequestClose={() => {
          setShowUpdatePlaylistModal(false);
        }}
        onSubmitUpdatePlaylist={handleSubmitUpdate}
        initialValue={selectedPlaylist!}
      />
      <CreatePlaylistModal
        visible={showCreatePlaylists}
        onRequestClose={() => {
          setShowCreatePlaylists(false);
        }}
        onSubmitCreatePlaylist={handleSubmitCreatePlaylist}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
  addBtn: {
    width: 42,
    height: 42,
    backgroundColor: colors.PRIMARY,
    borderRadius: 26,
    position: 'absolute',
    bottom: '5%',
    right: '5%',
  },
  sectionTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 15,
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

export default Playlists;
