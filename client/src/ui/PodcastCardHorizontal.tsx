import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Pressable, Image, Text, Alert} from 'react-native';

interface Props {
  poster?: string;
  title: string;
  owner: string;
  verified?: boolean | undefined;
  bgColor?: string;
  onPress?(): void;
  onLongPress?(): void;
}

const checkVerification = (verified: boolean | undefined) => {
  if (verified == undefined) return null;
  if (verified)
    return (
      <Text style={{color: colors.SUCCESS, fontSize: 12}}>Đã phê duyệt</Text>
    );
  if (!verified)
    return (
      <Text style={{color: colors.ERROR, fontSize: 12}}>Chưa phê duyệt</Text>
    );
};

const PodcastCardHorizontal: FC<Props> = ({
  poster,
  title,
  owner,
  verified,
  bgColor = colors.SECONDARY,
  onLongPress,
  onPress,
}) => {
  return (
    <Pressable
      style={{...styles.recommendPodcast, backgroundColor: bgColor}}
      onPress={onPress}
      onLongPress={onLongPress}>
      <View style={styles.horizontalSection}>
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
        <View style={styles.textSection}>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={2} ellipsizeMode="tail" style={styles.owner}>
            {owner}
          </Text>
          {checkVerification(verified)}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  recommendPodcast: {
    maxWidth: '100%',
    paddingHorizontal: 15,
    borderBottomColor: colors.CONTRAST_OVER,
    borderBottomWidth: 0.8,
  },
  poster: {
    maxHeight: 78,
    minWidth: 78,
    maxWidth: 78,
    minHeight: 78,
    aspectRatio: 1,
    borderRadius: 8,
    borderColor: colors.THIRD,
    borderWidth: 1,
  },
  textSection: {
    maxWidth: '85%',
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'opensans_bold',
    color: colors.CONTRAST,
    fontSize: 16,
  },
  owner: {
    fontFamily: 'opensans_bold',
    color: colors.PRIMARY,
    fontSize: 12,
    paddingBottom: 5,
  },
  horizontalSection: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
  },
});

export default PodcastCardHorizontal;
