import colors from '@utils/colors';
import {FC} from 'react';
import {StyleSheet, Pressable, Image, Text} from 'react-native';

interface Props {
  poster?: string;
  title: string;
  onPress?(): void;
  onLongPress?(): void;
}

const PodcastCard: FC<Props> = ({poster, title, onLongPress, onPress}) => {
  return (
    <Pressable
      style={styles.lastestPodcast}
      onPress={onPress}
      onLongPress={onLongPress}>
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
