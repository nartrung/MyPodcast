import colors from '@utils/colors';
import InputField from '@components/form/InputField';
import {FC} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';
import Form from '@components/form/Form';
import SubmitButton from '@components/form/SubmitButton';
import BackIcon from '@ui/BackIcon';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackNavigitionScreen} from 'src/@type/navigation';
import {FormikHelpers} from 'formik';
import axios from 'axios';

interface Props {}

interface UserEmail {
  email: string;
}

const initialValues = {
  email: '',
};

const emailValidationSchema = yup.object({
  email: yup
    .string()
    .trim('Vui lòng nhập Email của bạn')
    .email('Email không hợp lệ')
    .required('Vui lòng nhập Email của bạn'),
});

const ForgotPassword: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackNavigitionScreen>>();
  const handleSubmit = async (
    values: UserEmail,
    actions: FormikHelpers<UserEmail>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await axios.post(
        'http://10.0.2.2:8080/auth/forgot-password',
        {
          ...values,
        },
      );
      navigation.navigate('PasswordVerification', {id: data.id});
      console.log(data);
    } catch (err) {
      console.log('Sign Up Error', err);
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
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Image
          source={require('../../assets/images/MyPodcastForgotPassword.png')}
        />
      </View>
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={emailValidationSchema}>
        <View style={styles.formContainer}>
          <Text style={styles.text}>
            Vui lòng nhập email của bạn, chúng tôi sẽ giúp bạn tìm lại mật khẩu
          </Text>
          <InputField
            name="email"
            placeholder="example@gmail.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View>
            <SubmitButton title="Tiếp tục" />
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
  text: {
    marginBottom: 6,
    textAlign: 'justify',
    fontFamily: 'opensans_bold',
    color: colors.CONTRAST,
  },
});

export default ForgotPassword;
