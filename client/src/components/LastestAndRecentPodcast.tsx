import LoadingAnimation from '@ui/LoadingAnimation';
import PodcastCard from '@ui/PodcastCard';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import {
  AudioData,
  FetchLastestPodcast,
  FetchRecentPlayPodcast,
} from 'src/hooks/query';
import {RootState} from 'src/store';
import {getPlayerState} from 'src/store/player';

interface Props {
  onPodcastPress(item: AudioData, data: AudioData[]): void;
  onPodcastLongPress(item: AudioData, data: AudioData[]): void;
}

const dummyPodcast = new Array(4).fill('');

const LastestAndRecentPodcast: FC<Props> = ({
  onPodcastPress,
  onPodcastLongPress,
}) => {
  const {data, isLoading} = FetchLastestPodcast();
  const recentPlayPodcast = FetchRecentPlayPodcast().data;
  const onGoingAudio = useSelector(
    (rootState: RootState) => getPlayerState(rootState).onGoingAudio,
  );
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
      <Text style={styles.sectionTitle}>Mới & Đáng chú ý</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data?.map(item => {
          return (
            <PodcastCard
              title={item.title}
              key={item.id}
              poster={item.poster}
              onPress={() => onPodcastPress(item, data)}
              onLongPress={() => {
                onPodcastLongPress(item, data);
              }}
              playing={item.id === onGoingAudio?.id}
            />
          );
        })}
      </ScrollView>
      {recentPlayPodcast?.length !== 0 ? (
        <Text style={styles.sectionTitle}>Đã nghe gần đây</Text>
      ) : null}
      {recentPlayPodcast && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recentPlayPodcast?.map(item => {
            return (
              <PodcastCard
                title={item.title}
                key={item.id}
                poster={item.poster}
                onPress={() => onPodcastPress(item, recentPlayPodcast)}
                onLongPress={() => {
                  onPodcastLongPress(item, recentPlayPodcast);
                }}
                playing={item.id === onGoingAudio?.id}
              />
            );
          })}
        </ScrollView>
      )}
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

export default LastestAndRecentPodcast;
