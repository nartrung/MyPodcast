import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import PlaylistItem from '@ui/PlaylistItem';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {Playlist} from 'src/@type/playlist';
import {FetchUserPlaylist} from 'src/hooks/query';
import {
  updatePlaylistVisibility,
  updateSelectedPlaylistId,
} from 'src/store/playlist';

interface Props {
  route: any;
}

const UserPublicPlaylist: FC<Props> = props => {
  const {data, isLoading} = FetchUserPlaylist(props.route.params.userId);
  const dispatch = useDispatch();
  const handleOnPlaylistPress = (playlist: Playlist) => {
    dispatch(updateSelectedPlaylistId(playlist.id));
    dispatch(updatePlaylistVisibility(true));
  };
  if (isLoading)
    return (
      <LoadingAnimation>
        <AudioLoadingUI />
      </LoadingAnimation>
    );
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Danh sách phát</Text>
      {data?.map(playlist => {
        return (
          <PlaylistItem
            key={playlist.id}
            playlist={playlist}
            onPlaylistPress={() => handleOnPlaylistPress(playlist)}
          />
        );
      })}
    </ScrollView>
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
});

export default UserPublicPlaylist;
