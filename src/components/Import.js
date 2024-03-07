import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { DispatchContext } from '../Context';
import { ACTIONS } from '../Reducer';

const Import = ({ renderButton }) => {
  const dispatch = useContext(DispatchContext);

  const loadFromClipBoards = async () => {
    Alert.alert(
      'Do you really want to load new data?',
      'This will replace all you current Books.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Load',
          onPress: async () => {
            let newBooks = [];
            const jsonValue = await Clipboard.getString();
            try {
              newBooks = JSON.parse(jsonValue);
            } catch (e) {
              Alert.alert(
                'Invalid JSON',
                'The Data in the clipboard is invalid.',
              );
              return;
            }
            dispatch({
              type: ACTIONS.INIT_BOOKS,
              payload: { save: true, books: newBooks },
            });
            Alert.alert(
              'Success',
              'The new books have been loaded successfully.',
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <TouchableOpacity onPress={loadFromClipBoards}>
      {renderButton()}
    </TouchableOpacity>
  );
};

export default Import;
