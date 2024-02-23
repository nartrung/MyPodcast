import colors from '@utils/colors';
import {FC, useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppOTPFeild from '@ui/AppOTPFeild';
import AppLink from '@ui/AppLink';
import AppButton from '@ui/AppButton';
import BackIcon from '@ui/BackIcon';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackNavigitionScreen} from 'src/@type/navigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import Toast from 'react-native-toast-message';

type Props = NativeStackScreenProps<
  AuthStackNavigitionScreen,
  'EmailVerification'
>;

const OTPFeild = new Array(6).fill('');

const EmailVerification: FC<Props> = props => {
  const navigation = useNavigation<NavigationProp<AuthStackNavigitionScreen>>();

  const [otp, setOtp] = useState([...OTPFeild]);
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);

  const {userInfo} = props.route.params;

  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === 'Backspace') {
      if (!newOtp[index]) setActiveOTPIndex(index - 1);
      newOtp[index] = '';
    } else {
      setActiveOTPIndex(index + 1);
      newOtp[index] = value;
    }
    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  const isValidOtp = otp.every(value => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) return;

    try {
      await axios.post('http://10.0.2.2:8080/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });
      navigation.navigate('LogIn');
      Toast.show({
        type: 'success',
        text1: 'Xác thực thành công!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Mã xác thực không đúng',
      });
    }
  };

  const resendOTP = async () => {
    try {
      await axios.post('http://10.0.2.2:8080/auth/reverify-email', {
        userId: userInfo.id,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Đã có lỗi xảy ra!',
      });
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <BackIcon
          onIconPress={() => {
            navigation.navigate('LogIn');
          }}
        />
        <Text style={styles.title}>Xác thực Email</Text>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.text}>
          Một mã OTP đã được gửi đến email của bạn, vui lòng nhập mã OTP để xác
          thực.
        </Text>
        <View style={styles.OTPContainer}>
          {OTPFeild.map((_, index) => {
            return (
              <AppOTPFeild
                ref={activeOTPIndex === index ? inputRef : null}
                key={index}
                onKeyPress={({nativeEvent}) => {
                  handleChange(nativeEvent.key, index);
                }}
                keyboardType="numeric"
                onChangeText={handlePaste}
                value={otp[index] || ''}
              />
            );
          })}
        </View>
        <View style={styles.linkContainer}>
          <AppLink title="Gửi lại OTP" onPress={resendOTP} />
        </View>
        <View style={styles.submit}>
          <AppButton onPress={handleSubmit} title="Xác thực OTP" />
        </View>
      </View>
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
  OTPContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  text: {
    marginVertical: 24,
    textAlign: 'justify',
    fontFamily: 'opensans_regular',
    color: colors.CONTRAST,
  },
  linkContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  submit: {
    height: '37%',
    justifyContent: 'center',
  },
});

export default EmailVerification;
