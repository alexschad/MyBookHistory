/* global require */

import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeManager';

export default function NoItems({ items }) {
  const {
    theme: { styles },
  } = useTheme();
  const navigation = useNavigation();

  if (items === null) {
    return <></>;
  }
  return (
    <View style={styles.emptyListContainer}>
      <Pressable
        onPress={() => {
          navigation.navigate('Scanner');
        }}
        style={styles.navHeaderLink}>
        <Image source={require('../../assets/images/NoItems.png')} />
      </Pressable>
    </View>
  );
}
