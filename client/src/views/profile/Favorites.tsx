import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import PodcastCardHorizontal from '@ui/PodcastCardHorizontal';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import audioController from 'src/hooks/audioController';
import {FetchFavoritesPodcast} from 'src/hooks/query';

interface Props {}

const Favorites: FC<Props> = props => {
  const {data, isLoading} = FetchFavoritesPodcast();
  const {audioPress} = audioController();

  if (isLoading)
    return (
      <LoadingAnimation>
        <AudioLoadingUI />
      </LoadingAnimation>
    );
  return (
    <ScrollView>
      <View>
        <Text style={styles.sectionTitle}>Podcast yêu thích</Text>
        <View>
          {data?.map(item => {
            return (
              <PodcastCardHorizontal
                title={item.title}
                key={item.id}
                poster={item.poster}
                owner={item.owner}
                onLongPress={() => {}}
                onPress={() => {
                  audioPress(item, data);
                }}
              />
            );
          })}
        </View>
      </View>
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
  emptyTitle: {
    paddingTop: 100,
    alignItems: 'center',
  },
});

export default Favorites;
