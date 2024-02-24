import colors from '@utils/colors';
import {FC} from 'react';
import {StyleSheet, Pressable, Image, Text, Alert} from 'react-native';

interface Props {
  poster?: string;
  title: string;
}

const PodcastCard: FC<Props> = ({poster, title}) => {
  return (
    <Pressable
      style={styles.lastestPodcast}
      onPress={() => {
        Alert.alert('On press');
      }}
      onLongPress={() => {
        Alert.alert('On long press');
      }}>
      <Image
        style={styles.poster}
        source={
          poster
            ? {
                uri: poster,
              }
            : require('../assets/images/DummyPoster.png')
        }
      />
      <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  lastestPodcast: {
    width: 112,
    marginLeft: 15,
  },
  poster: {
    height: 112,
    aspectRatio: 1,
    borderRadius: 8,
    borderColor: colors.THIRD,
    borderWidth: 1,
  },
  title: {
    paddingVertical: 5,
    fontFamily: 'opensans_regular',
    color: colors.CONTRAST,
    fontSize: 12,
  },
});

export default PodcastCard;
