import colors from '@utils/colors';
import {FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';
import {FetchAutoPlaylist} from 'src/hooks/query';

interface Props {}

const AutoPlaylist: FC<Props> = props => {
  const {data} = FetchAutoPlaylist();
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Danh sát phát dành cho bạn</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}>
        {data?.map(item => {
          return (
            <Pressable key={item.id + '@'} style={styles.playlist}>
              <Image
                source={require('../assets/images/PlaylistForYou.png')}
                style={styles.image}
              />
              <View style={styles.overlay}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  image: {
    borderRadius: 8,
    width: 360,
  },
  scrollView: {
    marginBottom: 12,
    padding: 10,
  },
  sectionTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 20,
    marginVertical: 10,
    marginLeft: 15,
  },
  playlist: {
    paddingRight: 10,
  },
  overlay: {
    padding: 35,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  title: {
    width: '65%',
    color: colors.SECONDARY,
    fontFamily: 'opensans_bold',
    fontSize: 18,
  },
});

export default AutoPlaylist;
