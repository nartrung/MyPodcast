import AppModal from '@ui/AppModal';
import AudioLoadingUI from '@ui/AudioLoadingUI';
import PodcastCardHorizontal from '@ui/PodcastCardHorizontal';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import colors from '@utils/colors';
import axios from 'axios';
import {FC, useState} from 'react';
import {
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
  Animated,
} from 'react-native';
import {FlatList, Swipeable} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import audioController from 'src/hooks/audioController';
import {AudioData, PlaylistDetail, fetchPlaylistAudio} from 'src/hooks/query';
import {RootState} from 'src/store';
import {getPlaylistState, updatePlaylistVisibility} from 'src/store/playlist';

interface Props {}

const removeAudioFromPlaylist = async (id: string, playlistId: string) => {
  const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
  try {
    const url =
      'http://10.0.2.2:8080/playlist/delete?playlistId=' +
      playlistId +
      '&audioId=' +
      id;
    await axios.delete(url, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    Toast.show({
      type: 'success',
      text1: 'Đã xóa thành công',
    });
  } catch (error) {
    console.log(error);
    Toast.show({
      type: 'error',
      text1: 'Đã có lỗi xảy ra! Vui lòng thử lại.',
    });
  }
};

const PlayListAudioModal: FC<Props> = props => {
  const {visible, selectedPlaylistId, allowRemove} = useSelector(
    (rootState: RootState) => getPlaylistState(rootState),
  );

  const playlistID = selectedPlaylistId;
  const {data, refetch, isLoading} = useQuery(['playlist-audio', playlistID], {
    queryFn: () => fetchPlaylistAudio(playlistID!),
    enabled: !!playlistID,
  });

  refetch;
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(updatePlaylistVisibility(false));
  };
  const {audioPress} = audioController();

  const queryCLient = useQueryClient();
  const [removing, setRemoving] = useState(false);
  const removeMutation = useMutation({
    mutationFn: async ({id, playlistId}) => {
      removeAudioFromPlaylist(id, playlistId);
      queryCLient.invalidateQueries({queryKey: ['playlists']});
    },
    onMutate: (variable: {id: string; playlistId: string}) => {
      queryCLient.setQueryData<PlaylistDetail>(
        ['playlist-audio', playlistID],
        oldData => {
          let finalData: PlaylistDetail = {title: '', id: '', audios: []};
          if (!oldData) return finalData;
          const audios = oldData?.audios.filter(
            item => item.id !== variable.id,
          );
          return {...oldData, audios};
        },
      );
    },
  });
  const renderSwipeableItem: ListRenderItem<AudioData> = ({item}) => {
    return (
      <Swipeable
        onSwipeableOpen={() => {
          removeMutation.mutate({id: item.id, playlistId: playlistID || ''});
          setRemoving(false);
        }}
        onSwipeableWillOpen={() => {
          setRemoving(true);
        }}
        renderRightActions={() => {
          return (
            <View
              style={{
                flex: 1,
                height: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                backgroundColor: colors.ERROR,
              }}>
              <Animated.View>
                <Text
                  style={{
                    color: colors.SECONDARY,
                    fontFamily: 'opensans_bold',
                    paddingHorizontal: 10,
                    fontSize: 16,
                  }}>
                  {removing ? 'Đang xóa' : 'Xóa'}
                </Text>
              </Animated.View>
            </View>
          );
        }}>
        <PodcastCardHorizontal
          bgColor={colors.THIRD}
          title={item.title}
          key={item.id}
          poster={item.poster}
          owner={item.owner}
          onLongPress={() => {}}
          onPress={() => {
            audioPress(item, data?.audios || []);
            handleClose();
          }}
        />
      </Swipeable>
    );
  };
  const renderItem: ListRenderItem<AudioData> = ({item}) => {
    return (
      <PodcastCardHorizontal
        bgColor={colors.THIRD}
        title={item.title}
        key={item.id}
        poster={item.poster}
        owner={item.owner}
        onLongPress={() => {}}
        onPress={() => {
          audioPress(item, data?.audios || []);
          handleClose();
        }}
      />
    );
  };
  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <View>
        {isLoading ? (
          <AudioLoadingUI />
        ) : (
          <>
            <View style={styles.heading}>
              <Image
                source={require('../assets/images/PlaylistDetail.png')}
                style={styles.image}
              />
              <View style={styles.overlay}>
                <Text style={styles.playlistTitle}>{data?.title}</Text>
                <Text style={styles.playlistSubTitle}>
                  {data?.audios.length} Podcast
                </Text>
              </View>
            </View>
            <FlatList
              contentContainerStyle={styles.container}
              initialNumToRender={data?.audios.length}
              data={data?.audios}
              keyExtractor={item => item.id}
              renderItem={allowRemove ? renderSwipeableItem : renderItem}
            />
          </>
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 100,
  },
  overlay: {
    padding: 20,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  playlistTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 18,
  },
  playlistSubTitle: {
    color: colors.CONTRAST_OVERLAY,
    fontFamily: 'opensans_bold',
    fontSize: 14,
  },

  heading: {
    height: 100,
  },
  podcast: {
    maxWidth: '100%',
    flexDirection: 'row',
  },
  poster: {
    maxHeight: 78,
    minWidth: 78,
    maxWidth: 78,
    minHeight: 78,
    aspectRatio: 1,
    borderRadius: 8,
    borderColor: colors.THIRD,
    borderWidth: 1,
  },
  content: {
    justifyContent: 'center',
    padding: 10,
    maxWidth: '85%',
  },
  title: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 16,
  },
  owner: {
    color: colors.PRIMARY,
    fontFamily: 'opensans_bold',
  },
});

export default PlayListAudioModal;
