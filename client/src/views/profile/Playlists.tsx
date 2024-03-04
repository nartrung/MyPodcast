import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import PlaylistItem from '@ui/PlaylistItem';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {FetchPlaylist} from 'src/hooks/query';

interface Props {}

const Playlists: FC<Props> = props => {
  const {data, isLoading} = FetchPlaylist();
  if (isLoading)
    return (
      <LoadingAnimation>
        <AudioLoadingUI />
      </LoadingAnimation>
    );
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Danh sách phát của tôi</Text>
      {data?.map(playlist => {
        return <PlaylistItem key={playlist.id} playlist={playlist} />;
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

export default Playlists;
