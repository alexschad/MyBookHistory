import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { DataContext } from '../Context';

const Export = ({ renderButton }) => {
  const books = useContext(DataContext);
  const booksWithoutFilename = books.map(b => {
    return { ...b, filename: null };
  });

  const copyToClipboard = () => {
    Clipboard.setString(JSON.stringify(booksWithoutFilename));
    Alert.alert(
      'Data copied',
      'The book data has been copied to the clipboard.',
    );
  };

  return (
    <TouchableOpacity onPress={copyToClipboard}>
      {renderButton()}
    </TouchableOpacity>
  );
};

export default Export;
