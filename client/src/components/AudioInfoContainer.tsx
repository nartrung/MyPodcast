import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import {ScrollView} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {RootState} from 'src/store';
import {getPlayerState} from 'src/store/player';

interface Props {
  visible: boolean;
  closeHandler(state: boolean): void;
}

const AudioInfoContainer: FC<Props> = ({visible, closeHandler}) => {
  if (!visible) return null;
  const handleClose = () => {
    closeHandler(!visible);
  };
  const onGoingAudio = useSelector(
    (rootState: RootState) => getPlayerState(rootState).onGoingAudio,
  );
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text></Text>

        <Pressable onPress={handleClose}>
          <AntDesign name="close" size={24} />
        </Pressable>
      </View>

      <ScrollView>
        <Text style={styles.title} numberOfLines={1}>
          {onGoingAudio?.title}
        </Text>
        <View style={{flexDirection: 'row', marginVertical: 10}}>
          <Text>Tác giả: </Text>
          <AppLink title={onGoingAudio?.owner || ''} />
        </View>
        <Text>Mô tả:</Text>
        <Text style={styles.desc}>{onGoingAudio?.about}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: 'opensans_bold',
    fontSize: 18,
    color: colors.PRIMARY,
  },
  desc: {
    fontFamily: 'opensans_regular',
    fontSize: 14,
    textAlign: 'justify',
    color: colors.CONTRAST,
  },
});

export default AudioInfoContainer;
