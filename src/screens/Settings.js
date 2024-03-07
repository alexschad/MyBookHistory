import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, Linking, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeManager';
import Import from '../components/Import';
import Export from '../components/Export';
import Icons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntIcons from 'react-native-vector-icons/dist/AntDesign';

Icons.loadFont();

const Settings = () => {
  const {
    mode,
    theme: { styles, COLORS },
    changeMode,
  } = useTheme();

  const storeSettings = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@bookSettings', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    storeSettings({ mode });
  }, [mode]);

  const toggleSwitch = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    changeMode(newMode);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.settingsContainer}>
        <View style={styles.settingsRow}>
          <Icons
            name="theme-light-dark"
            size={25}
            color={COLORS.buttonAction}
          />
          <View style={styles.settingsModeContainer}>
            <Text style={styles.settingsText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: '#999', true: '#46bbff' }}
              thumbColor={mode ? '#ddd' : '#46bbff'}
              ios_backgroundColor="#999"
              onValueChange={toggleSwitch}
              value={mode === 'dark'}
            />
          </View>
        </View>
        <View style={styles.settingsRow}>
          <AntIcons
            name="questioncircleo"
            size={25}
            color={COLORS.buttonAction}
          />
          <Text
            style={styles.settingsText}
            onPress={() =>
              Linking.openURL(
                'https://vanguapps.com/bookhistory/bookhistory-userguide/',
              )
            }>
            Help
          </Text>
        </View>

        <View style={styles.settingsRow}>
          <Icons name="email-outline" size={25} color={COLORS.buttonAction} />
          <Text
            style={styles.settingsText}
            onPress={() =>
              Linking.openURL(
                'mailto:vanguapps@vanguardistas.net?subject=bookhistory%20Feeback',
              )
            }>
            Feedback/Suggestions
          </Text>
        </View>

        <View style={styles.settingsRow}>
          <Icons name="import" size={25} color={COLORS.buttonAction} />
          <Import
            renderButton={() => (
              <Text style={styles.settingsText}>
                Import Data from Clipboard
              </Text>
            )}
          />
        </View>
        <View style={styles.settingsRow}>
          <Icons
            style={styles.paddingLeft3}
            name="export"
            size={25}
            color={COLORS.buttonAction}
          />
          <Export
            renderButton={() => (
              <Text style={[styles.settingsText, styles.paddingLeft12]}>
                Export Data to Clipboard
              </Text>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
