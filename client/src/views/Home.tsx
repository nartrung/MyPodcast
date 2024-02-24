import {FC} from 'react';
import {View, StyleSheet, Text, Image, ScrollView} from 'react-native';
import LastestPodcast from '@components/LastestPodcast';
import colors from '@utils/colors';
import RecommendPodcast from '@components/RecommendPodcast';

interface Props {}

const Home: FC<Props> = props => {
  return (
    <ScrollView>
      <ScrollView
        scrollEnabled={false}
        style={styles.heading}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <Image
          style={styles.headingImage}
          source={require('../assets/images/DummyAvatar.png')}
        />
        <Text style={styles.headingTitle}>Nghe ngay</Text>
      </ScrollView>
      <LastestPodcast />
      <RecommendPodcast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    height: 60,
  },
  headingImage: {
    height: 40,
    aspectRatio: 1,
    borderRadius: 20,
    marginLeft: 24,
    marginTop: 10,
  },
  headingTitle: {
    color: colors.PRIMARY,
    fontSize: 32,
    fontFamily: 'opensans_bold',
    marginLeft: 12,
    marginTop: 10,
  },
});

export default Home;
