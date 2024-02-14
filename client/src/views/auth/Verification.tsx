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

interface Props {}

const OTPFeild = new Array(6).fill('');

const Verification: FC<Props> = props => {
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

  const handleSubmit = () => {
    console.log(otp.join(''));
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heading}>
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
        <View style={styles.linkContainer}>
          <AppLink title="Gửi lại OTP" />
        </View>
        <View>
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
});

export default Verification;
