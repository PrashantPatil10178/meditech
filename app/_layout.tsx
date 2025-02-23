// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font'; // Optional: For custom fonts
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  // Load custom fonts (optional)
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  // Show a loading state while fonts are loading (optional)
  if (!fontsLoaded) {
    return null; // Or return a loading spinner
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="auto" />

        {/* Stack Navigator for handling screens */}
        <Stack>
          {/* Auth Screens */}
          <Stack.Screen
            name="(auth)/Login"
            options={{ headerShown: false }} // Hide the default header
          />
          <Stack.Screen
            name="(auth)/Register"
            options={{ headerShown: false }} // Hide the default header
          />

          {/* Main Screens */}
          <Stack.Screen
            name="(main)/dashboard/index"
            options={{ headerShown: false }} // Hide the default header
          />
          <Stack.Screen
            name="(main)/profile/index"
            options={{ headerShown: false }} // Hide the default header
          />
          <Stack.Screen
            name="Meeting Appointments"
            options={{ headerShown: true }} // Hide the default header
          />
          <Stack.Screen
            name="(main)/notifications/index"
            options={{ headerShown: false }} // Hide the default header
          />
          <Stack.Screen
            name="(main)/medications/index"
            options={{ headerShown: false }} // Hide the default header
          />
          <Stack.Screen
            name="(main)/teleconsultation/index"
            options={{ headerShown: true, title: 'Meeting Page' }}
          />
          <Stack.Screen name="(main)/community/index" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Styles for the root layout
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Use your app's background color
  },
});
