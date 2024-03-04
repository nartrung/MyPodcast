import AudioLoadingUI from '@ui/AudioLoadingUI';
import LoadingAnimation from '@ui/LoadingAnimation';
import colors from '@utils/colors';
import {FC, useState} from 'react';
import {View, StyleSheet, ScrollView, Pressable, Alert} from 'react-native';
import {Text} from 'react-native';
import {FetchHistories} from 'src/hooks/query';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import Toast from 'react-native-toast-message';
import {useQueryClient} from 'react-query';
import Loader from '@ui/Loader';

interface Props {}

const Histories: FC<Props> = props => {
  const [busy, setBusy] = useState(false);
  const {data, isLoading} = FetchHistories();
  const queryClient = useQueryClient();

  const clearHistory = async () => {
    try {
      const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
      const {data} = await axios.delete(
        'http://10.0.2.2:8080/history?all=yes',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      queryClient.invalidateQueries({queryKey: ['histories']});
      if (data) {
        Toast.show({
          type: 'info',
          text1: 'Đã xóa toàn bộ lịch sử',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra! Vui lòng thử lại',
      });
    }
  };
  const clearSingleAudio = async (audioID: string) => {
    setBusy(true);
    try {
      const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
      const {data} = await axios.delete(
        'http://10.0.2.2:8080/history?audioId=' + audioID,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );
      queryClient.invalidateQueries({queryKey: ['histories']});
      if (data) {
        Toast.show({
          type: 'success',
          text1: 'Xóa thành công',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra! Vui lòng thử lại',
      });
    }
    setBusy(false);
  };
  const handleClearAll = () => {
    return Alert.alert(
      'Xóa toàn bộ lịch sử nghe',
      'Bạn có chắc muốn xóa toàn bộ lịch sử?',
      [
        {
          text: 'Đóng',
        },
        {
          text: 'Xóa toàn bộ',
          onPress: clearHistory,
        },
      ],
    );
  };

  if (isLoading)
    return (
      <LoadingAnimation>
        <AudioLoadingUI />
      </LoadingAnimation>
    );
  return (
    <ScrollView style={styles.container}>
      <View style={styles.titleAndDel}>
        <Text style={styles.sectionTitle}>Lịch sử nghe</Text>
        <Pressable onPress={handleClearAll}>
          <Text style={styles.del}>Xóa tất cả</Text>
        </Pressable>
      </View>
      {data?.map((item, index) => {
        return (
          <View key={item.date + index}>
            <Text style={styles.date}>{item.date}</Text>
            {item.audios.map(audio => {
              return (
                <View key={audio.id + index} style={styles.history}>
                  <Text style={styles.historyTitle}>{audio.title}</Text>
                  {busy ? (
                    <Loader />
                  ) : (
                    <Pressable onPress={() => clearSingleAudio(audio.id)}>
                      <AntDesign name="close" size={24} />
                    </Pressable>
                  )}
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
  titleAndDel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  del: {
    fontFamily: 'opensans_bold',
    color: colors.ERROR,
    fontSize: 16,
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
