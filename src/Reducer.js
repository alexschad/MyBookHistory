import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';

export const ACTIONS = {
  INIT_BOOKS: 'init_books',
  DATA_SAVED: 'data_saved',
  ADD_BOOK: 'add_book',
  EDIT_BOOK_DATA: 'edit_book_data',
  DELETE_BOOK: 'delete_book',
  EDIT_BOOK_TAGS: 'edit_book_tags',
  SET_BOOK_FILENAME: 'set_book_filename',
};

const reducer = ({ save, books }, action) => {
  switch (action.type) {
    // set initial books
    case ACTIONS.INIT_BOOKS:
      return {
        save: action.payload.save,
        books: action.payload.books,
      };
    case ACTIONS.DATA_SAVED:
      return { save: false, books };
    // add a new book
    case ACTIONS.ADD_BOOK: {
      return {
        save: true,
        books: [
          {
            id: uuid.v4(),
            title: action.payload.title,
            isbn: action.payload.isbn,
            description: action.payload.description,
            filename: '',
            tags: action.payload.tags || [],
            created: Date.now(),
          },
          ...books,
        ],
      };
    }
    // edit book data
    case ACTIONS.EDIT_BOOK_DATA:
      return {
        save: true,
        books: books.map(l => {
          if (l.id === action.payload.bookId) {
            return {
              ...l,
              title: action.payload.title,
              description: action.payload.description,
            };
          }
          return l;
        }),
      };
    // delete book
    case ACTIONS.DELETE_BOOK: {
      const bookIndex = books.findIndex(i => i.id === action.payload.bookId);
      var path = `${RNFS.DocumentDirectoryPath}/${books[bookIndex].filename}`;

      RNFS.unlink(path)
        .then(() => {
          console.log('FILE DELETED');
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch(err => {
          console.log(err.message);
        });
      return {
        save: true,
        books: books.filter(l => l.id !== action.payload.id),
      };
    }
    // edit tags for a book
    case ACTIONS.EDIT_BOOK_TAGS: {
      const bookIndex = books.findIndex(i => i.id === action.payload.bookId);
      books[bookIndex].tags = action.payload.tags;
      return {
        save: true,
        books,
      };
    }
    // set book filename
    case ACTIONS.SET_BOOK_FILENAME:
      return {
        save: true,
        books: books.map(b => {
          if (b.id === action.payload.bookId) {
            return {
              ...b,
              filename: action.payload.filename,
            };
          }
          return b;
        }),
      };
    default:
      return { save, books };
  }
};

export default reducer;
