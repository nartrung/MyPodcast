import ModalContainer from '@ui/ModalContainer';
import colors from '@utils/colors';
import {FC, useEffect, useState} from 'react';
import {View, StyleSheet, TextInput, Text, Button} from 'react-native';
import {Playlist} from 'src/@type/playlist';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

interface Props {
  visible: boolean;
  initialValue: Playlist;
  onRequestClose(): void;
  onSubmitUpdatePlaylist(title: string, isPrivate: boolean): void;
}

const UpdatePlaylistInfoModal: FC<Props> = ({
  visible,
  initialValue,
  onRequestClose,
  onSubmitUpdatePlaylist: onSubmitUpdatePlaylist,
}) => {
  const [playlist, setPlaylist] = useState({
    title: '',
    private: false,
  });

  const handleCloseForm = () => {
    onRequestClose();
  };
  useEffect(() => {
    if (initialValue) {
      setPlaylist({
        title: initialValue.title,
        private: initialValue.visibility === 'private',
      });
    }
  }, [initialValue]);
  return (
    <ModalContainer visible={visible} onRequestClose={handleCloseForm}>
      <Text style={{fontSize: 16, fontFamily: 'opensans_bold'}}>
        Cập nhật thông tin Playlist
      </Text>
      <View>
        <TextInput
          onChangeText={text => setPlaylist({...playlist, title: text})}
          style={styles.input}
          defaultValue={playlist.title}></TextInput>
        <BouncyCheckbox
          isChecked={playlist.private}
          style={styles.checkBox}
          onPress={(isChecked: boolean) => {
            setPlaylist({...playlist, private: isChecked});
          }}
          text="Đặt làm riêng tư"
          textStyle={{
            textDecorationLine: 'none',
          }}
        />
      </View>
      <Button
        title="Cập nhật"
        color={colors.PRIMARY}
        onPress={() => {
          onSubmitUpdatePlaylist(playlist.title, playlist.private);
        }}></Button>
    </ModalContainer>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: colors.STROKE,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    marginTop: 24,
  },
  checkBox: {
    marginVertical: 10,
  },
});

export default UpdatePlaylistInfoModal;
