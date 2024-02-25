import ModalContainer from '@ui/ModalContainer';
import {FC, ReactNode} from 'react';
import {StyleSheet, ScrollView, Pressable, Text} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Playlist} from 'src/@type/playlist';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  list: Playlist[];
  onCreatePlaylistPress?(): void;
  onAddToPlaylistPress(item: Playlist): void;
}

interface PlaylistItemProps {
  title: string;
  icon: ReactNode;
  onPress?(): void;
}

const PlaylistItem: FC<PlaylistItemProps> = ({title, icon, onPress}) => {
  return (
    <Pressable style={styles.playlist} onPress={onPress}>
      {icon}
      <Text style={styles.playlistName}>{title}</Text>
    </Pressable>
  );
};

const PlaylistModal: FC<Props> = ({
  visible,
  onRequestClose,
  list,
  onCreatePlaylistPress,
  onAddToPlaylistPress,
}) => {
  return (
    <ModalContainer visible={visible} onRequestClose={onRequestClose}>
      <Text style={{fontSize: 16, fontFamily: 'opensans_regular'}}>
        Chọn Playlist thêm vào
      </Text>
      <ScrollView>
        {list.map(item => {
          return (
            <PlaylistItem
              onPress={() => onAddToPlaylistPress(item)}
              key={item.id}
              title={item.title}
              icon={
                <FontAwesome6
                  name={item.visibility === 'public' ? 'globe' : 'lock'}
                  style={styles.playlistIcon}></FontAwesome6>
              }
            />
          );
        })}
        <PlaylistItem
          onPress={onCreatePlaylistPress}
          title="Tạo playlist mới"
          icon={
            <MaterialIcons
              name="add"
              style={styles.playlistIcon}></MaterialIcons>
          }
        />
      </ScrollView>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  playlist: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  playlistIcon: {
    fontSize: 24,
    paddingHorizontal: 11,
  },
  playlistName: {
    fontFamily: 'opensans_regular',
    fontSize: 18,
  },
});

export default PlaylistModal;
