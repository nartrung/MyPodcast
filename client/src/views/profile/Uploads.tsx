import LoadingAnimation from '@ui/LoadingAnimation';
import PodcastCardHorizontal from '@ui/PodcastCardHorizontal';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {FetchUploadedPodcast} from 'src/hooks/query';

interface Props {}

const dummyPodcast = new Array(6).fill('');

const Uploads: FC<Props> = props => {
  const {data, isLoading} = FetchUploadedPodcast();
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
    <ScrollView>
      <View>
        <Text style={styles.sectionTitle}>Podcast đã đăng tải</Text>
        <View>
          {data?.map(item => {
            return (
              <PodcastCardHorizontal
                verified={item.verified}
                title={item.title}
                key={item.id}
                poster={item.poster}
                owner={item.owner}
                onLongPress={() => {}}
                onPress={() => {}}
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
  emptyTitle: {
    paddingTop: 100,
    alignItems: 'center',
  },
});

export default Uploads;
