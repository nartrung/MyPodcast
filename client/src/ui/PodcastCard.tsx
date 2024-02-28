import colors from '@utils/colors';
import {FC} from 'react';
import {StyleSheet, Pressable, Image, Text, View} from 'react-native';
import PlayingAudioAnimation from './PlayingAudioAnimation';

interface Props {
  poster?: string;
  title: string;
  playing?: boolean;
  onPress?(): void;
  onLongPress?(): void;
}

const PodcastCard: FC<Props> = ({
  poster,
  title,
  playing = false,
  onLongPress,
  onPress,
}) => {
  return (
    <Pressable
      style={styles.lastestPodcast}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View>
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
        <PlayingAudioAnimation visible={playing} />
      </View>

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
