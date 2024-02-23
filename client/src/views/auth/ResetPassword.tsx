import colors from '@utils/colors';
import InputField from '@components/form/InputField';
import {FC, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';
import Form from '@components/form/Form';
import SubmitButton from '@components/form/SubmitButton';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackNavigitionScreen} from 'src/@type/navigation';
import {FormikHelpers} from 'formik';
import axios from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import BackIcon from '@ui/BackIcon';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<AuthStackNavigitionScreen, 'ResetPassword'>;

interface NewPassword {
  password: '';
}

const initialValues = {
  password: '',
};

const PasswordValidationSchema = yup.object({
  password: yup
    .string()
    .trim('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Mật khẩu phải gồm 1 số, 1 ký tự thường và 1 ký tự đặc biệt',
    )
    .required('Vui lòng nhập mật khẩu'),
});

const ResetPassword: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackNavigitionScreen>>();

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  const {id} = props.route.params;
  const handleSubmit = async (
    values: NewPassword,
    actions: FormikHelpers<NewPassword>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await axios.post(
        'http://10.0.2.2:8080/auth/change-password',
        {
          ...values,
          userId: id,
        },
      );
      navigation.navigate('LogIn');
      Toast.show({
        type: 'success',
        text1: 'Đổi mật khẩu thành công',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra!',
      });
    }
    actions.setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackIcon
        onIconPress={() => {
          navigation.navigate('ForgotPassword');
        }}
      />
      <View style={styles.heading}>
        <Image source={require('../../assets/images/MyPodcastLogo.png')} />
        <Text style={styles.title}>Đổi mật khẩu</Text>
      </View>
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={PasswordValidationSchema}>
        <View style={styles.formContainer}>
          <InputField
            name="password"
            placeholder="********"
            label="Mật khẩu mới"
            secureTextEntry={secureEntry}
            icon={<PasswordVisibilityIcon showIcon={secureEntry} />}
            onIconPress={togglePasswordVisibility}
          />
          <View style={styles.submit}>
            <SubmitButton title="Đổi mật khẩu" />
          </View>
        </View>
      </Form>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  formContainer: {
    width: '100%',
  },
  heading: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'opensans_bold',
    fontSize: 32,
    marginBottom: 12,
    color: colors.PRIMARY,
  },
  submit: {
    height: '40%',
    justifyContent: 'center',
  },
});

export default ResetPassword;
