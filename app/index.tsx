// app/index.tsx
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { account } from '../services/appwrite'; // Import Appwrite account service

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Track login state

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Fetch the current user session
        const user = await account.get();
        if (user) {
          setIsLoggedIn(true); // User is logged in
        }
      } catch (error) {
        console.log('User is not logged in:', error);
        setIsLoggedIn(false); // Assume user is not logged in on error
      }
    };

    checkLoginStatus();
  }, []);

  // Show a loading spinner while checking login status
  if (isLoggedIn === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2C7A7B" />
      </View>
    );
  }

  // Redirect based on login status
  return isLoggedIn ? <Redirect href="/(main)/dashboard" /> : <Redirect href="/(auth)/Login" />;
}

// Styles for the loading container
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8', // Use your app's background color
  },
});
