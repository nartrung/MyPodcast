import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, ScrollView, Pressable} from 'react-native';
import {Text} from 'react-native';
import {FetchHistories} from 'src/hooks/query';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface Props {}

const Histories: FC<Props> = props => {
  const {data, isLoading} = FetchHistories();
  if (isLoading)
    return (
      <LoadingAnimation>
        <AudioLoadingUI />
      </LoadingAnimation>
    );
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Lịch sử nghe</Text>
      {data?.map((item, index) => {
        return (
          <View key={item.date + index}>
            <Text style={styles.date}>{item.date}</Text>
            {item.audios.map(audio => {
              return (
                <View key={audio.id + index} style={styles.history}>
                  <Text style={styles.historyTitle}>{audio.title}</Text>
                  <Pressable>
                    <AntDesign name="close" size={24} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sectionTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
    fontSize: 20,
  },
  date: {
    color: colors.PRIMARY,
    marginVertical: 5,
    fontFamily: 'opensans_bold',
    fontSize: 16,
  },
  historyTitle: {
    color: colors.CONTRAST,
    fontFamily: 'opensans_bold',
  },
  history: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.STROKE,
    borderRadius: 8,
    marginVertical: 6,
  },
});

export default Histories;
