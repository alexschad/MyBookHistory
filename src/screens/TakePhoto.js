import React, { useContext, useRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { DataContext, DispatchContext } from '../Context';
import { ACTIONS } from '../Reducer';
import { useTheme } from '../ThemeManager';

export default function TakePhoto({ route }) {
  const { bookId } = route.params;
  const dispatch = useContext(DispatchContext);
  const books = useContext(DataContext);
  const book = books.find(e => e.id === bookId);
  const navigation = useNavigation();
  const {
    theme: { styles },
  } = useTheme();
  const camera = useRef(null);

  const device = useCameraDevice('back');

  const takePhoto = async () => {
    const file = await camera.current.takePhoto();
    const extension = file.path.split('.').at(-1);
    const oldPath = `${RNFS.DocumentDirectoryPath}/${book.filename}`;
    RNFS.exists(oldPath).then(exists => {
      if (exists) {
        RNFS.unlink(oldPath)
          .then(() => {
            console.log('FILE DELETED');
          })
          // `unlink` will throw an error, if the item to unlink does not exist
          .catch(err => {
            console.log(err.message);
          });
      }
    });
    const filename = `${Math.random().toString(36).substring(7)}.${extension}`;
    const newPath = `${RNFS.DocumentDirectoryPath}/${filename}`;
    RNFS.moveFile(file.path, newPath)
      .then(() => {
        dispatch({
          type: ACTIONS.SET_BOOK_FILENAME,
          payload: {
            bookId: bookId,
            filename,
          },
        });
      })
      .catch(err => {
        console.log('Error: ' + err.message);
      });
    navigation.goBack();
  };

  if (device === null) {
    return (
      <View style={styles.body}>
        <Text>No Camera</Text>
      </View>
    );
  }

  return (
    <>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <Pressable
        onPress={takePhoto}
        title="Take Photo"
        style={styles.takePhotoButton}
      />
    </>
  );
}
