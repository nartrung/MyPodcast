import colors from '@utils/colors';
import {forwardRef} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  ref: any;
}

const AppOTPFeild = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput {...props} ref={ref} style={styles.OTPFeild} />;
});

const styles = StyleSheet.create({
  OTPFeild: {
    width: 45,
    height: 45,
    borderRadius: 43,
    borderColor: colors.PRIMARY,
    borderWidth: 1,
    color: colors.CONTRAST,
    fontSize: 16,
    fontFamily: 'opensans_bold',
    textAlign: 'center',
  },
});

export default AppOTPFeild;
