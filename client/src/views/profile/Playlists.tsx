import OptionsModal from '@components/OptionsModal';
import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import PlaylistItem from '@ui/PlaylistItem';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {StyleSheet, Text, ScrollView, Pressable, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@type/playlist';
import {FetchPlaylist} from 'src/hooks/query';
import playlist, {
  updatePlaylistVisibility,
  updateSelectedPlaylistId,
} from 'src/store/playlist';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UpdatePlaylistInfoModal from '@components/UpdatePlaylistInfoModal';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {useQueryClient} from 'react-query';

interface Props {}

const Playlists: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [showUpdatePlaylistModal, setShowUpdatePlaylistModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>();
  const {data, isLoading} = FetchPlaylist();
  const dispatch = useDispatch();
  const handleOnPlaylistPress = (playlist: Playlist) => {
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
      <ScrollView style={styles.container}>
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
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
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
