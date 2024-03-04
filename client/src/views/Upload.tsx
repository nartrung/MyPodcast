import CategorySelector from '@components/CategorySelector';
import FileSelector from '@components/FileSelector';
import Form from '@components/form/Form';
import InputField from '@components/form/InputField';
import SubmitButton from '@components/form/SubmitButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import AppInput from '@ui/AppInput';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import colors from '@utils/colors';
import axios from 'axios';
import {FormikHelpers} from 'formik';
import {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Alert,
  Button,
} from 'react-native';
import {DocumentPickerResponse, types} from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {ProfileStackNavigitionScreen} from 'src/@type/navigation';
import {RootState} from 'src/store';
import {getAuthState} from 'src/store/auth';
import * as yup from 'yup';

interface Props {}

interface UploadForm {
  title: string;
  desc: string;
  category: string;
  file?: DocumentPickerResponse;
  poster?: DocumentPickerResponse;
}

const category = [
  'Nghệ thuật',
  'Kinh doanh',
  'Giáo dục',
  'Giải trí',
  'Kể chuyện',
  'Âm nhạc',
  'Khoa học',
  'Công nghệ',
  'Khác',
];

const initialValues = {
  title: '',
  desc: '',
};

const FileValidationSchema = yup.object({
  category: yup
    .string()
    .oneOf(category, 'Vui lòng chọn Thể loại')
    .required('Vui lòng chọn Thể loại'),
  file: yup.object().shape({
    uri: yup.string().required('Vui lòng chọn tệp âm thanh'),
    name: yup.string().required('Vui lòng chọn tệp âm thanh'),
    type: yup.string().required('Vui lòng chọn tệp âm thanh'),
    size: yup.number().required('Vui lòng chọn tệp âm thanh'),
  }),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
});

const UploadFileValidationSchema = yup.object({
  title: yup
    .string()
    .trim('Vui lòng nhập Tiêu đề')
    .required('Vui lòng nhập Tiêu đề'),
  desc: yup
    .string()
    .trim('Vui lòng nhập mô tả')
    .required('Vui lòng nhập mô tả'),
});

const Upload: FC<Props> = props => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [podcastCategory, setPodcastCategory] = useState('Chọn thể loại');
  const [podcastFile, setPodcastFile] = useState<DocumentPickerResponse>();
  const [podcastPoster, setPodcastPoster] = useState<DocumentPickerResponse>();
  const queryClient = useQueryClient();
  const handleSubmit = async (
    values: UploadForm,
    actions: FormikHelpers<UploadForm>,
  ) => {
    actions.setSubmitting(true);
    try {
      values.file = podcastFile;
      values.category = podcastCategory;
      values.poster = podcastPoster;
      const fileData = await FileValidationSchema.validate(values);

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.desc);
      formData.append('category', fileData.category);
      formData.append('file', {
        name: fileData.file.name,
        type: fileData.file.type,
        uri: fileData.file.uri,
      });
      if (fileData.poster.uri)
        formData.append('poster', {
          name: fileData.poster.name,
          type: fileData.poster.type,
          uri: fileData.poster.uri,
        });

      const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
      await axios.post('http://10.0.2.2:8080/audio/upload', formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data;',
        },
      });
      Alert.alert(
        'Thành công',
        'Podcast đã được upload thành công, vui lòng chờ Admin phê duyệt',
        [{text: 'Đóng'}],
      );
      queryClient.invalidateQueries({queryKey: ['uploaded-podcast']});
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        Toast.show({
          type: 'error',
          text1: error.message,
          text1Style: {
            fontSize: 16,
          },
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Đã có lỗi xảy ra, vui lòng thử lại!',
          topOffset: 20,
        });
      }
    }

    actions.setSubmitting(false);
  };
  const profile = useSelector(
    (rootState: RootState) => getAuthState(rootState).profile,
  );
  const navigation =
    useNavigation<NavigationProp<ProfileStackNavigitionScreen>>();
  if (!profile?.verified) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đăng tải Podcast</Text>
        <View style={styles.lockFeature}>
          <Text style={styles.title}>Email chưa được xác thực</Text>
          <Text style={styles.info}>
            Vui lòng xác thực email của bạn để sử dụng tính năng Upload Podcast
          </Text>
          <Button
            title="Đi đến trang xác thực"
            color={colors.PRIMARY}
            onPress={() => {
              navigation.navigate('Profile');
            }}></Button>
        </View>
      </View>
    );
  } else {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Đăng tải Podcast</Text>
        <View style={styles.fileSelector}>
          <FileSelector
            icon={
              <MaterialComIcons
                name="file-upload-outline"
                size={32}
                color={colors.PRIMARY}></MaterialComIcons>
            }
            btnTitle="Tải tệp âm thanh"
            fileName={podcastFile?.name ?? undefined}
            options={{type: [types.audio]}}
            onSelect={file => {
              setPodcastFile(file);
            }}
          />
          <FileSelector
            icon={
              <MaterialComIcons
                name="camera"
                size={32}
                color={colors.PRIMARY}></MaterialComIcons>
            }
            btnTitle="Tải ảnh đại diện"
            fileName={podcastPoster?.name ?? undefined}
            options={{type: [types.images]}}
            onSelect={file => {
              setPodcastPoster(file);
            }}
          />
        </View>
        <View>
          <CategorySelector
            visible={showCategoryModal}
            onRequestClose={() => {
              setShowCategoryModal(false);
            }}
            data={category}
            renderItem={item => {
              return <Text style={styles.category}>{item}</Text>;
            }}
            onSelect={item => {
              setPodcastCategory(item);
            }}
          />
        </View>
        <View>
          <Text style={styles.label}>Thể loại</Text>
        </View>
        <Pressable
          onPress={() => {
            setShowCategoryModal(true);
          }}>
          <View>
            <AppInput editable={false} value={podcastCategory} />
          </View>
        </Pressable>
        <Form
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={UploadFileValidationSchema}>
          <View style={styles.formContainer}>
            <InputField
              name="title"
              placeholder="Tiêu đề"
              label="Tiêu đề Podcast"
            />
            <InputField
              name="desc"
              placeholder="Mô tả"
              label="Mô tả Podcast"
              numberOfLines={6}
              multinine={true}
              textAlignVertical="top"
            />
            <View>
              <SubmitButton title="Đăng tải" />
            </View>
          </View>
        </Form>
      </ScrollView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    fontFamily: 'opensans_bold',
    fontSize: 20,
    marginVertical: 34,
    color: colors.CONTRAST,
  },
  fileSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  category: {
    padding: 10,
    fontFamily: 'opensans_regular',
  },
  label: {
    color: colors.CONTRAST,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 14,
    fontFamily: 'opensans_bold',
  },
  icon: {
    position: 'absolute',
  },
  lockFeature: {
    backgroundColor: colors.THIRD,
    borderRadius: 8,
    padding: 20,
    paddingTop: 0,
  },
  info: {
    fontFamily: 'opensans_regular',
    color: colors.CONTRAST,
    textAlign: 'center',
    marginBottom: 34,
  },
});

export default Upload;
