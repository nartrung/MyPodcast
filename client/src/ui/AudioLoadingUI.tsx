import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet} from 'react-native';

interface Props {}
const dummyPodcast = new Array(6).fill('');
const AudioLoadingUI: FC<Props> = props => {
  return (
    <View>
      <View style={styles.dummyTitle} />
      <View>
        {dummyPodcast.map((_, i) => {
          return <View key={i} style={styles.dummyPodcast} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dummyTitle: {
    height: 27,
    width: 170,
    marginVertical: 10,
    marginLeft: 15,
    borderRadius: 9,
    backgroundColor: colors.STROKE,
  },
  dummyPodcast: {
    height: 79,
    maxWidth: '100%',
    borderRadius: 8,
    backgroundColor: colors.STROKE,
    marginHorizontal: 15,
    marginBottom: 15,
  },
});

export default AudioLoadingUI;
