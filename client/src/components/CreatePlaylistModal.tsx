import ModalContainer from '@ui/ModalContainer';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {View, StyleSheet, TextInput, Text, Button} from 'react-native';

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onSubmitCreatePlaylist(title: string): void;
}

const CreatePlaylistModal: FC<Props> = ({
  visible,
  onRequestClose,
  onSubmitCreatePlaylist,
}) => {
  const [playlistTitle, setPlaylistTitle] = useState('');

  const handleCloseForm = () => {
    onRequestClose();
    setPlaylistTitle('');
  };
  return (
    <ModalContainer visible={visible} onRequestClose={handleCloseForm}>
      <Text style={{fontSize: 16, fontFamily: 'opensans_bold'}}>
        Tạo Playlist mới
      </Text>
      <View>
        <TextInput
          onChangeText={text => {
            setPlaylistTitle(text);
          }}
          placeholder="Tên playlist"
          style={styles.input}
          value={playlistTitle}></TextInput>
      </View>
      <Button
        title="Tạo"
        color={colors.PRIMARY}
        onPress={() => {
          onSubmitCreatePlaylist(playlistTitle);
          setPlaylistTitle('');
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
    marginVertical: 24,
  },
});

export default CreatePlaylistModal;
