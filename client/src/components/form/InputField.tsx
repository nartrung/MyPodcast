import {FC, ReactNode} from 'react';
import {View, StyleSheet, Text, TextInputProps, Pressable} from 'react-native';
import AppInput from '@ui/AppInput';
import colors from '@utils/colors';
import {useFormikContext} from 'formik';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: boolean;
  multinine?: boolean;
  numberOfLines?: number;
  icon?: ReactNode;
  textAlignVertical?: 'auto' | 'center' | 'top' | 'bottom' | undefined;
  onIconPress?(): void;
}

const InputField: FC<Props> = props => {
  const {handleChange, values, errors, handleBlur, touched} = useFormikContext<{
    [key: string]: string;
  }>();
  const {
    name,
    label,
    placeholder,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
    multinine,
    numberOfLines,
    icon,
    textAlignVertical,
    onIconPress,
  } = props;
  const errorMassage = touched[name] && errors[name] ? errors[name] : '';
  return (
    <View>
      <View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View>
        <AppInput
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onChangeText={handleChange(name)}
          value={values[name]}
          onBlur={handleBlur(name)}
          multiline={multinine}
          numberOfLines={numberOfLines}
          textAlignVertical={textAlignVertical}
        />
        {icon ? (
          <Pressable onPress={onIconPress} style={styles.icon}>
            {icon}
          </Pressable>
        ) : null}
      </View>
      <View>
        {errorMassage && <Text style={styles.error}>{errorMassage}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {
    color: colors.CONTRAST,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 14,
    fontFamily: 'opensans_bold',
  },
  error: {
    color: colors.ERROR,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontFamily: 'opensans_regular',
    fontSize: 12,
  },
  icon: {
    width: 48,
    height: 48,
    position: 'absolute',
    right: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InputField;
