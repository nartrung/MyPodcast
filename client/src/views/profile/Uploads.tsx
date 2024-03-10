import {NavigationProp, useNavigation} from '@react-navigation/native';
import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import PodcastCardHorizontal from '@ui/PodcastCardHorizontal';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {ProfileStackNavigitionScreen} from 'src/@type/navigation';
import {FetchUploadedPodcast} from 'src/hooks/query';

interface Props {}

const Uploads: FC<Props> = props => {
  const {data, isLoading} = FetchUploadedPodcast();
  const navigation =
    useNavigation<NavigationProp<ProfileStackNavigitionScreen>>();

  if (isLoading)
    return (
      <LoadingAnimation>
        <AudioLoadingUI />
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
                onPress={() => {
                  navigation.navigate('AudioUpdate', {audio: item});
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

export default Uploads;
