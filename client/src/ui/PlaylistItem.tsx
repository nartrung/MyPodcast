import {FC} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {Playlist} from 'src/@type/playlist';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import colors from '@utils/colors';

interface Props {
  playlist: Playlist;
  onPlaylistPress?(): void;
}

const PlaylistItem: FC<Props> = ({playlist, onPlaylistPress}) => {
  const {id, title, itemsCount, visibility} = playlist;
  return (
    <Pressable style={styles.container} onPress={onPlaylistPress}>
      <View style={styles.icon}>
        <Entypo name="folder-music" size={40} color={colors.CONTRAST} />
      </View>
      <View style={{width: '100%'}}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        <View style={{flexDirection: 'row'}}>
          {visibility === 'public' ? (
            <MaterialIcons
              name="public"
              size={20}
              style={styles.visibilityIcon}
            />
          ) : (
            <MaterialIcon name="lock" size={20} style={styles.visibilityIcon} />
          )}
          <Text style={styles.itemCount}>{itemsCount} Podcast</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.THIRD,
    height: 78,
    margin: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  icon: {
    padding: 15,
  },
  title: {
    fontFamily: 'opensans_bold',
    fontSize: 16,
    color: colors.CONTRAST,
    width: '80%',
    marginBottom: 5,
  },
  itemCount: {
    fontFamily: 'opensans_bold',
    backgroundColor: colors.PRIMARY,
    color: colors.CONTRAST,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  visibilityIcon: {
    marginRight: 4,
  },
});

export default PlaylistItem;
