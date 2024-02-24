import {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import LastestPodcast from '@components/LastestPodcast';
import colors from '@utils/colors';
import RecommendPodcast from '@components/RecommendPodcast';
import OptionsModal from '@components/OptionsModal';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AudioData} from 'src/hooks/query';
import axios from 'axios';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import Toast from 'react-native-toast-message';

interface Props {}

const Home: FC<Props> = props => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<AudioData>();

  const handleAddFav = async () => {
    if (!selectedPodcast) return;
    const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
    try {
      const {data} = await axios.post(
        'http://10.0.2.2:8080/favorite?audioId=' + selectedPodcast.id,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (data) {
        Toast.show({
          type: 'success',
          text1: 'Đã thêm vào yêu thích',
        });
      }
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra',
      });
    }
    setSelectedPodcast(undefined);
    setShowOptions(false);
  };
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
      <LastestPodcast
        onPodcastLongPress={item => {
          setShowOptions(true);
          setSelectedPodcast(item);
        }}
        onPodcastPress={item => {
          console.log(item);
        }}
      />
      <RecommendPodcast
        onPodcastLongPress={item => {
          setShowOptions(true);
          setSelectedPodcast(item);
        }}
        onPodcastPress={item => {
          console.log(item);
        }}
      />
      <OptionsModal
        visible={showOptions}
        onRequestClose={() => {
          setShowOptions(false);
        }}
        options={[
          {
            title: 'Thêm vào Danh sách yêu thích',
            icon: 'cards-heart-outline',
            onPress: handleAddFav,
          },
          {title: 'Thêm vào Playlist', icon: 'playlist-music'},
        ]}
        poster={selectedPodcast?.poster}
        title={selectedPodcast?.title}
        renderItem={item => {
          return (
            <Pressable onPress={item.onPress} style={styles.options}>
              <MaterialComIcons name={item.icon} style={styles.optionsIcon} />
              <Text style={styles.optionsTitle}>{item.title}</Text>
            </Pressable>
          );
        }}
      />
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
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionsIcon: {
    fontSize: 24,
    color: colors.PRIMARY,
    paddingHorizontal: 11,
  },
  optionsTitle: {
    fontFamily: 'opensans_regular',
    fontSize: 18,
  },
});

export default Home;
