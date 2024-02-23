import colors from '@utils/colors';
import {FC, ReactNode} from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';

interface Props {
  icon?: ReactNode;
  btnTitle?: string;
  onSelect(file: DocumentPickerResponse): void;
  options: DocumentPickerOptions<SupportedPlatforms>;
  fileName?: string;
}

const FileSelector: FC<Props> = ({
  icon,
  btnTitle,
  onSelect,
  options,
  fileName,
}) => {
  const handleSelectDocument = async () => {
    try {
      const doc = await DocumentPicker.pick(options);
      const file = doc[0];
      onSelect(file);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.log(error);
      }
    }
  };
  return (
    <View>
      <Pressable onPress={handleSelectDocument} style={styles.btnContainer}>
        <View style={styles.iconContainer}>
          {icon}
          <Text style={styles.btnTitle}>{btnTitle}</Text>
        </View>
      </Pressable>
      {fileName && (
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.fileName}>
          {fileName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  iconContainer: {
    height: 100,
    aspectRatio: 1.5,
    borderWidth: 2,
    borderColor: colors.PRIMARY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTitle: {
    fontFamily: 'opensans_bold',
    fontSize: 14,
    marginTop: 12,
  },
  fileName: {
    textAlign: 'center',
    maxWidth: 180,
    paddingVertical: 4,
  },
});

export default FileSelector;
