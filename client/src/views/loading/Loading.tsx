import Loader from '@ui/Loader';
import colors from '@utils/colors';
import {FC} from 'react';
import {SafeAreaView, View, StyleSheet, Text, Image} from 'react-native';

interface Props {}

const Loading: FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={require('../../assets/images/MyPodcastLoading.png')} />
      </View>
      <Loader />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});

export default Loading;
