import LoadingAnimation from '@ui/LoadingAnimation';
import PlaylistItem from '@ui/PlaylistItem';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {FetchPlaylist} from 'src/hooks/query';

interface Props {}

const dummyPodcast = new Array(6).fill('');

const Playlists: FC<Props> = props => {
  const {data, isLoading} = FetchPlaylist();
  if (isLoading)
    return (
      <LoadingAnimation>
        <View>
          <View style={styles.dummyTitle} />
          <View>
            {dummyPodcast.map((_, i) => {
              return <View key={i} style={styles.dummyPodcast} />;
            })}
          </View>
        </View>
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
  dummyTitle: {
    height: 27,
    width: 170,
    marginVertical: 10,
    marginLeft: 15,
    borderRadius: 9,
    backgroundColor: colors.STROKE,
  },
  dummyPodcast: {
    height: 79,
    maxWidth: '100%',
    borderRadius: 8,
    backgroundColor: colors.STROKE,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 15,
  },
});

export default Playlists;
