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
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackNavigitionScreen} from 'src/@type/navigation';
import BackIcon from '@ui/BackIcon';
import axios from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<
  AuthStackNavigitionScreen,
  'PasswordVerification'
>;

const OTPFeild = new Array(6).fill('');

const PasswordVerification: FC<Props> = props => {
  const [otp, setOtp] = useState([...OTPFeild]);
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);

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
  const {id} = props.route.params;
  const handleSubmit = async () => {
    if (!isValidOtp) return;

    try {
      const {data} = await axios.post(
        'http://10.0.2.2:8080/auth/verify-pass-token',
        {
          userId: id,
          token: otp.join(''),
        },
      );
      navigation.navigate('ResetPassword', {id: id});

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  const navigation = useNavigation<NavigationProp<AuthStackNavigitionScreen>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
        <BackIcon
          onIconPress={() => {
            navigation.navigate('ForgotPassword');
          }}
        />
        <Text style={styles.title}>Quên mật khẩu</Text>
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
  submit: {
    height: '37%',
    justifyContent: 'center',
  },
});

export default PasswordVerification;
