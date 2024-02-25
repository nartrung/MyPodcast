import {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';

interface Props {}

const Playlists: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text>Playlist</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Playlists;
