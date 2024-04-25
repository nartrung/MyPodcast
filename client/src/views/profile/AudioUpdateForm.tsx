import CategorySelector from '@components/CategorySelector';
import FileSelector from '@components/FileSelector';
import Form from '@components/form/Form';
import InputField from '@components/form/InputField';
import SubmitButton from '@components/form/SubmitButton';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AppInput from '@ui/AppInput';
import {getDataFromAsyncStorage, keys} from '@utils/asyncStorage';
import colors from '@utils/colors';
import axios from 'axios';
import {FormikHelpers} from 'formik';
import {FC, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import {DocumentPickerResponse, types} from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import MaterialComIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useQueryClient} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {ProfileStackNavigitionScreen} from 'src/@type/navigation';
import {FetchProfile} from 'src/hooks/query';
import {RootState} from 'src/store';
import {getAuthState, updateProfile} from 'src/store/auth';
import * as yup from 'yup';

type Props = NativeStackScreenProps<
  ProfileStackNavigitionScreen,
  'AudioUpdate'
>;

interface EditPodcastForm {
  title: string;
  description: string;
  category: string;
  poster?: DocumentPickerResponse;
}

const initialValues = {
  title: undefined,
  description: undefined,
};

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

const FileValidationSchema = yup.object({
  category: yup.string().oneOf(category, 'Vui lòng chọn Thể loại'),
  poster: yup.object().shape({
    uri: yup.string(),
    name: yup.string(),
    type: yup.string(),
    size: yup.number(),
  }),
});

const UploadFileValidationSchema = yup.object({
  title: yup.string(),
  description: yup.string(),
});

const AudioUpdateForm: FC<Props> = props => {
  const {audio} = props.route.params;
  const navigation =
    useNavigation<NavigationProp<ProfileStackNavigitionScreen>>();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [podcastCategory, setPodcastCategory] = useState(
    audio.category as string,
  );
  const [podcastPoster, setPodcastPoster] = useState<DocumentPickerResponse>();
  const queryClient = useQueryClient();
  const handleSubmit = async (
    values: EditPodcastForm,
    actions: FormikHelpers<EditPodcastForm>,
  ) => {
    actions.setSubmitting(true);
    try {
      values.category = podcastCategory;
      values.poster = podcastPoster;
      const fileData = await FileValidationSchema.validate(values);

      const formData = new FormData();
      if (values.title) formData.append('title', values.title);
      if (values.description)
        formData.append('description', values.description);
      if (fileData.category) formData.append('category', fileData.category);
      if (fileData.poster.uri) {
        formData.append('poster', {
          name: fileData.poster.name,
          type: fileData.poster.type,
          uri: fileData.poster.uri,
        });
      }

      const token = await getDataFromAsyncStorage(keys.AUTH_TOKEN);
      await axios.patch('http://10.0.2.2:8080/audio/' + audio.id, formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data;',
        },
      });
      Toast.show({
        type: 'success',
        text1: 'Cập nhật thành công',
      });
      navigation.navigate('Profile');
      queryClient.invalidateQueries({queryKey: ['uploaded-podcast']});
      queryClient.invalidateQueries({queryKey: ['histories']});
      queryClient.invalidateQueries({queryKey: ['favorites-podcast']});
      queryClient.invalidateQueries({queryKey: ['recommend-podcast']});
      queryClient.invalidateQueries({queryKey: ['lastest-podcast']});
      queryClient.invalidateQueries({queryKey: ['recent-play']});
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra, vui lòng thử lại!',
      });
    }

    actions.setSubmitting(false);
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin Podcast</Text>
      <View style={styles.fileSelector}>
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
          <AppInput
            editable={false}
            value={podcastCategory}
            placeholder={audio.category}
          />
        </View>
      </Pressable>
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={UploadFileValidationSchema}>
        <View style={styles.formContainer}>
          <InputField
            name="title"
            label="Tiêu đề Podcast"
            defaultValue={audio.title}
          />
          <InputField
            name="description"
            label="Mô tả Podcast"
            numberOfLines={6}
            multinine={true}
            textAlignVertical="top"
            defaultValue={audio.description}
          />
          <View>
            <SubmitButton title="Cập nhật" />
          </View>
        </View>
      </Form>
    </ScrollView>
  );
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

export default AudioUpdateForm;
