import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Pressable,
  View,
  TextInput,
  Text,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  useCameraFormat,
} from 'react-native-vision-camera';
import AntIcon from 'react-native-vector-icons/dist/AntDesign';
import { useTheme } from '../ThemeManager';
import CameraOverlay from '../components/CameraOverlay';

const getAuthors = async authors => {
  if (!authors) {
    return [];
  }
  const authorNames = await Promise.all(
    authors.map(async author => {
      const url = `https://openlibrary.org${author.key}.json`;
      const response = await fetch(url);
      if (response.status === 200) {
        const jsonData = await response.json();
        return jsonData.name;
      }
    }),
  );
  return authorNames;
};

const EnterISBNLink = ({
  styles,
  COLORS,
  showManualISBN,
  setShowManualISBN,
}) => {
  return (
    <Pressable
      onPress={() => {
        setShowManualISBN(!showManualISBN);
      }}
      style={styles.navHeaderLink}>
      {showManualISBN ? (
        <AntIcon name="minus" size={20} color={COLORS.buttonAction} />
      ) : (
        <AntIcon name="plus" size={20} color={COLORS.buttonAction} />
      )}
    </Pressable>
  );
};

const headerRightComponent =
  (showManualISBN, setShowManualISBN, styles, COLORS) => () =>
    (
      <EnterISBNLink
        showManualISBN={showManualISBN}
        setShowManualISBN={setShowManualISBN}
        styles={styles}
        COLORS={COLORS}
      />
    );
export default function Scanner() {
  const [isbn, setISBN] = useState();
  const [bookData, setBookData] = useState();
  const [authors, setAuthors] = useState([]);
  const [manualISBN, setManualISBN] = useState();
  const [showManualISBN, setShowManualISBN] = useState(false);
  const navigation = useNavigation();
  const device = useCameraDevice('back');

  const {
    theme: { styles, COLORS },
  } = useTheme();

  useEffect(() => {
    navigation.setOptions({
      headerRight: headerRightComponent(
        showManualISBN,
        setShowManualISBN,
        styles,
        COLORS,
      ),
    });
  }, [navigation, showManualISBN, COLORS, styles]);

  useEffect(() => {
    async function fetchData(url) {
      const response = await fetch(url);
      if (response.status === 200) {
        const jsonData = await response.json();
        const authorNames = await getAuthors(jsonData.authors);
        setAuthors(authorNames);
        setBookData(jsonData);
      } else {
        setAuthors([]);
        setBookData({ error: 'Book not found', isbn_13: [''] });
      }
    }
    if (isbn) {
      const url = `https://openlibrary.org/isbn/${isbn}.json`;
      fetchData(url);
    }
  }, [isbn]);

  const addManualISBN = () => {
    Keyboard.dismiss();
    setISBN(manualISBN);
  };

  const format = useCameraFormat(device, [
    { videoResolution: { width: 1920, height: 1080 } },
    { fps: 60 },
  ]);

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        setISBN(codes[0].value);
      } else {
        setISBN(null);
      }
    },
  });

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
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
        device={device}
        isActive={true}
        format={format}
      />
      {showManualISBN && (
        <View style={styles.manualISBNContainer}>
          <TextInput
            placeholder="Enter ISBN"
            keyboardType="numeric"
            placeholderTextColor={COLORS.placeholderText}
            style={{
              ...styles.smallInput,
              ...styles.border,
              ...{ flexGrow: 1 },
            }}
            onChangeText={value => setManualISBN(value)}
            value={manualISBN}
          />
          <Pressable onPress={addManualISBN} style={styles.manualISBNButton}>
            <Text style={styles.manualISBNButtonText}>Add</Text>
          </Pressable>
        </View>
      )}
      <CameraOverlay
        {...bookData}
        setISBN={setISBN}
        setBookData={setBookData}
        authors={authors}
      />
    </>
  );
}
