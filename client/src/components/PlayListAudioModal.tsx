import AppModal from '@ui/AppModal';
import AudioLoadingUI from '@ui/AudioLoadingUI';
import PodcastCardHorizontal from '@ui/PodcastCardHorizontal';
import colors from '@utils/colors';
import {FC} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {fetchPlaylistAudio} from 'src/hooks/query';
import {RootState} from 'src/store';
import {
  getPlaylistState,
  updatePlaylistVisibility,
  updateSelectedPlaylistId,
} from 'src/store/playlist';

interface Props {}

const PlayListAudioModal: FC<Props> = props => {
  const {visible, selectedPlaylistId} = useSelector((rootState: RootState) =>
    getPlaylistState(rootState),
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
              data={data?.audios}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <PodcastCardHorizontal
                    title={item.title}
                    key={item.id}
                    poster={item.poster}
                    owner={item.owner}
                    onLongPress={() => {}}
                    onPress={() => {}}
                  />
                );
              }}
            />
          </>
        )}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {},
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
