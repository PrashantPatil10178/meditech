import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';

const VideoCallScreen = () => {
  const { roomName, userInfo } = useLocalSearchParams();

  // Parse userInfo from string to object
  if (typeof userInfo !== 'string') {
    throw new Error('userInfo must be a string');
  }
  const parsedUserInfo = userInfo ? JSON.parse(userInfo) : { displayName: 'Guest' };

  const jitsiURL = `https://meet.jit.si/${roomName || 'DemoAppointment'}#userInfo.displayName="${parsedUserInfo.displayName}"`;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: jitsiURL }} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
});

export default VideoCallScreen;
