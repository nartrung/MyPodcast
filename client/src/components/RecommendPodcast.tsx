import LoadingAnimation from '@ui/LoadingAnimation';
import PodcastCardHorizontal from '@ui/PodcastCardHorizontal';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {FetchRecommendPodcast} from 'src/hooks/query';

interface Props {}

const dummyPodcast = new Array(4).fill('');

const RecommendPodcast: FC<Props> = props => {
  const {data, isLoading} = FetchRecommendPodcast();
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
    <View>
      <Text style={styles.sectionTitle}>Có thể bạn sẽ thích</Text>
      <View>
        {data?.map(item => {
          return (
            <PodcastCardHorizontal
              title={item.title}
              key={item.id}
              poster={item.poster}
              owner={item.owner}
            />
          );
        })}
      </View>
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

export default RecommendPodcast;
