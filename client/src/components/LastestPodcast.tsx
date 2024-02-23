import LoadingAnimation from '@ui/LoadingAnimation';
import PodcastCard from '@ui/PodcastCard';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {FetchLastestPodcast} from 'src/hooks/query';

interface Props {}

const dummyPodcast = new Array(4).fill('');

const LastestPodcast: FC<Props> = props => {
  const {data, isLoading} = FetchLastestPodcast();
  if (isLoading)
    return (
      <LoadingAnimation>
        <View>
          <View style={styles.dummyTitle} />
          <View style={styles.dummyContainer}>
            {dummyPodcast.map((_, i) => {
              return <View key={i} style={styles.dummyPodcast} />;
            })}
          </View>
        </View>
      </LoadingAnimation>
    );
  return (
    <View>
      <Text style={styles.sectionTitle}>Podcast đăng tải gần đây</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map(item => {
          return (
            <PodcastCard
              title={item.title}
              key={item.id}
              poster={item.poster}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dummyTitle: {
    height: 27,
    width: 170,
    marginVertical: 10,
    marginLeft: 15,
    borderRadius: 9,
    backgroundColor: colors.STROKE,
  },
  dummyPodcast: {
    height: 112,
    width: 112,
    borderRadius: 8,
    backgroundColor: colors.STROKE,
    marginLeft: 15,
  },
  dummyContainer: {
    flexDirection: 'row',
  },

  sectionTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 15,
  },
});

export default LastestPodcast;
