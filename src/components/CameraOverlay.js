import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import React, { useContext, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ACTIONS } from '../Reducer';
import { DataContext, DispatchContext } from '../Context';

const CameraOverlay = ({
  title,
  full_title,
  description,
  isbn_13,
  authors,
  error,
  setISBN,
  setBookData,
}) => {
  const navigation = useNavigation();
  const dispatch = useContext(DispatchContext);
  const books = useContext(DataContext);
  const prevBooksLen = useRef(books?.length);

  useEffect(() => {
    if (prevBooksLen.current < books?.length) {
      // a book got added so we navigate back to the home view
      navigation.goBack();
    }
    prevBooksLen.current = books?.length;
  }, [navigation, books]);

  const addBookManually = () => {
    navigation.navigate('AddBook');
  };
  const addBook = () => {
    if (
      !isbn_13[0] ||
      books.find(b => {
        return b.isbn === isbn_13[0];
      })
    ) {
      navigation.goBack();
      return;
    }

    dispatch({
      type: ACTIONS.ADD_BOOK,
      payload: {
        title: title,
        isbn: isbn_13[0],
        description: description || full_title || '',
        tags: authors,
      },
    });
  };

  const hideOverlay = () => {
    setBookData({ isbn_13: null });
    setISBN(null);
  };

  if (!isbn_13 || isbn_13.length === 0) {
    return;
  }

  return (
    <View style={styles.cameraContainer}>
      {error ? (
        <View style={styles.overlayErrorContainer}>
          <Text style={styles.bookTitle}>{error}</Text>
          <Pressable onPress={addBookManually} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Add it yourself</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.overlayContainer}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: `https://covers.openlibrary.org/b/isbn/${isbn_13[0]}-S.jpg`,
            }}
          />
          <View style={styles.bookTextContainer}>
            <Text style={styles.bookTitle}>{title}</Text>
            {authors && authors.length > 0 && (
              <Text style={styles.bookAuthors}>by {authors.join(', ')}</Text>
            )}
            <Text style={styles.bookDescription}>
              {description || full_title || ''}
            </Text>
          </View>
          <Pressable onPress={addBook} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
          <Pressable onPress={hideOverlay} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>x</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CameraOverlay;

const styles = StyleSheet.create({
  transparent: 'transparent',
  bookTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    alignSelf: 'center',
  },
  bookAuthors: {
    fontSize: 10,
    marginLeft: 10,
  },
  bookDescription: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bookTextContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 15,
  },
  overlayErrorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  overlayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'white',
  },
  tinyLogo: {
    width: 40,
    height: 60,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 10,
  },
  errorButton: {
    padding: 12,
    backgroundColor: '#46bbff',
    borderRadius: 20,
  },
  errorButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: 'blue',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingTop: 3,
    paddingBottom: 5,
    marginLeft: 2,
    marginRight: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 15,
  },
  closeButton: {
    backgroundColor: 'red',
    position: 'absolute',
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    top: 2,
    right: 2,
    paddingHorizontal: 4,
    paddingTop: 0,
    paddingBottom: 2,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 10,
  },
});
