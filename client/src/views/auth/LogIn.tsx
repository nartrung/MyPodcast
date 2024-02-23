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
import {updateLogInState, updateProfile} from 'src/store/auth';
import {useDispatch} from 'react-redux';
import {keys, storeToAsyncStorage} from '@utils/asyncStorage';
import Toast from 'react-native-toast-message';

interface Props {}

interface LogInUser {
  email: '';
  password: '';
}

const initialValues = {
  email: '',
  password: '',
};

const logInValidationSchema = yup.object({
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

const LogIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const [wrongPassword, setWrongPassword] = useState(false);
  const navigation = useNavigation<NavigationProp<AuthStackNavigitionScreen>>();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: LogInUser,
    actions: FormikHelpers<LogInUser>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await axios.post('http://10.0.2.2:8080/auth/sign-in', {
        ...values,
      });
      Toast.show({
        type: 'success',
        text1: 'Đăng nhập thành công ',
      });
      await storeToAsyncStorage(keys.AUTH_TOKEN, data.token);
      dispatch(updateProfile(data.profile));
      dispatch(updateLogInState(true));
    } catch (err) {
      setWrongPassword(true);
    }
    actions.setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Image source={require('../../assets/images/MyPodcastLogo.png')} />
        <Text style={styles.title}>Đăng nhập</Text>
      </View>

      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={logInValidationSchema}>
        <View style={styles.formContainer}>
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
          {wrongPassword && (
            <Text style={styles.wrongPassword}>
              Email hoặc mật khẩu không đúng! Vui lòng thử lại!
            </Text>
          )}
          <View style={styles.linkContainer}>
            <AppLink
              title="Quên mật khẩu"
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            />
            <AppLink
              title="Đăng ký tài khoản"
              onPress={() => {
                navigation.navigate('SignUp');
              }}
            />
          </View>
          <View>
            <Text style={styles.policy}>
              Bằng cách tiếp tục, bạn đã đồng ý với
              <Text style={styles.innerText}> Chính sách bảo mật </Text>
              và
              <Text style={styles.innerText}> Quyền riêng tư </Text>
              của
              <Text style={styles.innerText}> My Podcast</Text>
            </Text>
            <SubmitButton title="Đăng nhập" />
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
    justifyContent: 'space-between',
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
  policy: {
    marginBottom: 8,
    textAlign: 'justify',
  },
  innerText: {
    color: colors.PRIMARY,
  },
  wrongPassword: {
    height: 36,
    width: '100%',
    color: colors.ERROR,
    paddingHorizontal: 14,
    paddingTop: 8,
    marginBottom: 24,
    marginTop: 8,
    fontFamily: 'opensans_regular',
    fontSize: 14,
    backgroundColor: colors.THIRD,
    borderRadius: 2,
  },
});

export default LogIn;
