import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import PodcastCardHorizontal from '@ui/PodcastCardHorizontal';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {FetchUserUploadedPodcast} from 'src/hooks/query';

interface Props {
  route: any;
}

const UserPublicUploads: FC<Props> = props => {
  const {data, isLoading} = FetchUserUploadedPodcast(props.route.params.userId);
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
  sectionTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 20,
    marginTop: 10,
    marginLeft: 15,
  },
});

export default UserPublicUploads;
