import colors from '@utils/colors';
import {FC, ReactNode} from 'react';
import {View, StyleSheet, Modal, Pressable} from 'react-native';

interface Props {
  visible?: boolean;
  onRequestClose?(): void;
  children: ReactNode;
}

const ModalContainer: FC<Props> = ({onRequestClose, visible, children}) => {
  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      animationType="slide"
      transparent>
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onRequestClose} />
        <View style={styles.modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0 0 0 / 0.4)',
    zIndex: -1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  modal: {
    width: '90%',
    maxHeight: '100%',
    borderRadius: 16,
    padding: 12,
    backgroundColor: colors.SECONDARY,
  },
  title: {
    fontFamily: 'opensans_bold',
    color: colors.PRIMARY,
    fontSize: 18,
    paddingVertical: 8,
  },
});

export default ModalContainer;
