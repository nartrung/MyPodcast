import colors from '@utils/colors';
import {FC} from 'react';
import Icon from 'react-native-vector-icons/Entypo';

interface Props {
  showIcon: boolean;
}

const PasswordVisibilityIcon: FC<Props> = ({showIcon}) => {
  return showIcon ? (
    <Icon name="eye" color={colors.PRIMARY} size={24} />
  ) : (
    <Icon name="eye-with-line" color={colors.PRIMARY} size={24} />
  );
};

export default PasswordVisibilityIcon;
