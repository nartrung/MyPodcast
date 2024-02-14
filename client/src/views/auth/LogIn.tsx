import colors from '@utils/colors';
import InputField from '@components/form/InputField';
import {FC, useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';
import Form from '@components/form/Form';
import SubmitButton from '@components/form/SubmitButton';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';

interface Props {}

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

  const togglePasswordVisibility = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <Image source={require('../../assets/images/MyPodcastLogo.png')} />
        <Text style={styles.title}>Đăng nhập</Text>
      </View>
      <Form
        onSubmit={values => {
          console.log(values);
        }}
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
          <View style={styles.linkContainer}>
            <AppLink title="Quên mật khẩu" />
            <AppLink title="Đăng ký tài khoản" />
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
});

export default LogIn;
