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
import BackIcon from '@ui/BackIcon';
import {FormikHelpers} from 'formik';
import axios, {AxiosError} from 'axios';
import Toast from 'react-native-toast-message';

interface Props {}

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const signUpValidationSchema = yup.object({
  name: yup
    .string()
    .trim('Vui lòng nhập họ tên')
    .required('Vui lòng nhập họ tên của bạn'),
  email: yup
    .string()
    .trim('Vui lòng nhập Email của bạn')
    .email('Email không hợp lệ')
    .required('Vui lòng nhập Email của bạn'),
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

const SignUp: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackNavigitionScreen>>();

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await axios.post('http://10.0.2.2:8080/auth/register', {
        ...values,
      });
      navigation.navigate('EmailVerification', {userInfo: data.user});
    } catch (err) {
      if (err instanceof AxiosError)
        Toast.show({
          type: 'error',
          text1: 'Email đã được sử dụng! Vui lòng thử lại!',
        });
      else
        Toast.show({
          type: 'error',
          text1: 'Đã có lỗi trong quá trình xử lý!',
        });
    }
    actions.setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <BackIcon
          onIconPress={() => {
            navigation.navigate('LogIn');
          }}
        />
        <Image source={require('../../assets/images/MyPodcastLogo.png')} />
        <Text style={styles.title}>Đăng ký tài khoản</Text>
      </View>
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={signUpValidationSchema}>
        <View style={styles.formContainer}>
          <InputField
            name="name"
            placeholder="Tên của bạn"
            label="Họ tên"
            autoCapitalize="words"
          />
          <InputField
            name="email"
            placeholder="example@gmail.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            name="password"
            placeholder="********"
            label="Mật khẩu"
            secureTextEntry={secureEntry}
            icon={<PasswordVisibilityIcon showIcon={secureEntry} />}
            onIconPress={togglePasswordVisibility}
          />
          <View style={styles.linkContainer}>
            <Text style={styles.text}>Đã có tài khoản?</Text>
            <AppLink
              title=" Đăng nhập ngay"
              onPress={() => {
                navigation.navigate('LogIn');
              }}
            />
          </View>
          <View>
            <Text style={styles.policy}>
              Bằng cách tiếp tục, bạn đã đồng ý với{' '}
              <Text style={styles.innerText}> Chính sách bảo mật </Text>
              và
              <Text style={styles.innerText}> Quyền riêng tư </Text>
              của
              <Text style={styles.innerText}> My Podcast</Text>
            </Text>
            <SubmitButton title="Đăng ký" />
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
  linkContainer: {
    flexDirection: 'row',
    marginBottom: 24,
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
  text: {
    fontFamily: 'opensans_regular',
  },
  policy: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  innerText: {
    color: colors.PRIMARY,
  },
});

export default SignUp;
