import colors from '@utils/colors';
import {FC} from 'react';
import {StyleSheet, TextInput, TextInputProps} from 'react-native';

interface Props extends TextInputProps {}

const AppInput: FC<Props> = props => {
  return <TextInput {...props} style={styles.input}></TextInput>;
};

const styles = StyleSheet.create({
  container: {},
  input: {
    borderWidth: 2,
    borderColor: colors.STROKE,
    borderRadius: 8,
    color: colors.CONTRAST,
    marginBottom: 6,
    paddingLeft: 16,
    fontFamily: 'opensans_regular',
    fontSize: 16,
  },
});

export default AppInput;
