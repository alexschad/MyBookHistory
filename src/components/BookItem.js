import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AntIcon from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import RNFS from 'react-native-fs';

import { ACTIONS } from '../Reducer';
import {
  RectButton,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { useTheme } from '../ThemeManager';
import { DispatchContext } from '../Context';

const BookItem = ({ setTagFilter, book }) => {
  const dispatch = useContext(DispatchContext);
  const navigation = useNavigation();
  const {
    theme: { styles, COLORS },
  } = useTheme();

  const renderRightActions = () => {
    return (
      <View style={styles.rightActions}>
        <Animated.View style={styles.rightActionsAnimatedView}>
          <RectButton
            style={[styles.rightAction, styles.rightActionsRectButton]}
            onPress={deleteBook}>
            <AntIcon name="delete" size={25} color={COLORS.text} />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  const onTagPress = tag => {
    return () => {
      setTagFilter(tag);
    };
  };

  const deleteBook = () => {
    Alert.alert(
      'Delete the book?',
      'You will lose all book data...',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            dispatch({
              type: ACTIONS.DELETE_BOOK,
              payload: { id: book.id },
            });
          },
        },
      ],
      { cancelable: false },
    );
  };

  const onEdit = () => {
    navigation.navigate('EditBook', {
      bookId: book.id,
    });
  };

  const doubleTap = Gesture.Tap()
    .runOnJS(true)
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        onEdit();
      }
    });

  let uri = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
  if (book.filename !== null) {
    uri = `file://${RNFS.DocumentDirectoryPath}/${book.filename}`;
  }

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <GestureDetector gesture={doubleTap}>
        <View style={styles.bookItemContainer}>
          <View style={styles.bookItemImageContainer}>
            <FontAwesome5
              style={styles.mediumLogoIcon}
              name="book"
              size={60}
              color={COLORS.buttonAction}
            />
            <Image
              style={styles.mediumLogo}
              source={{
                uri,
              }}
            />
          </View>
          <View style={styles.bookItemTextContainer}>
            <Text style={styles.bookItemText}>{book.title}</Text>
            <Text style={styles.bookItemTextSmall}>{book.description}</Text>
            {book.tags.length > 0 && (
              <View style={styles.bookListItemTags}>
                {book.tags.map((tag, index) => (
                  <TouchableOpacity
                    key={`${tag}-${index}`}
                    style={styles.tagItemContainer}
                    onPress={onTagPress(tag)}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </GestureDetector>
    </Swipeable>
  );
};

export default BookItem;
