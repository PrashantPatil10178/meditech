import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { account, ID } from '../../services/appwrite'; // Import Appwrite account service and ID
import DateTimePicker from '@react-native-community/datetimepicker'; // For date picker
import RadioGroup from 'react-native-radio-buttons-group'; // For radio buttons

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Date of birth
  const [gender, setGender] = useState(''); // Gender
  const [medicalConditions, setMedicalConditions] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [showDatePicker, setShowDatePicker] = useState(false); // Show/hide date picker
  const router = useRouter(); // Expo Router navigation

  // Radio buttons for gender
  const genderOptions = [
    {
      id: 'male',
      label: 'Male',
      value: 'male',
    },
    {
      id: 'female',
      label: 'Female',
      value: 'female',
    },
    {
      id: 'other',
      label: 'Other',
      value: 'other',
    },
  ];

  const validateInputs = () => {
    if (!name || !email || !password || !gender) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Validate password length
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return; // Stop if validation fails
    }

    setLoading(true); // Start loading

    try {
      // Register the user using Appwrite
      await account.create(ID.unique(), email, password, name);

      // Log in the user after successful registration
      await account.createEmailPasswordSession(email, password);

      // Redirect to the main dashboard after successful registration and login
      router.replace('/(main)/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle date picker changes
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Join HealthHub</Text>
        <Text style={styles.subHeaderText}>Start your journey to better health</Text>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Feather name="user" size={24} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Feather name="mail" size={24} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Feather name="lock" size={24} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Feather name="calendar" size={24} color="#4A5568" style={styles.icon} />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.input}>
              {dateOfBirth.toLocaleDateString()} {/* Display selected date */}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Gender */}
        <View style={styles.inputContainer}>
          <Feather name="users" size={24} color="#4A5568" style={styles.icon} />
          <RadioGroup
            radioButtons={genderOptions}
            onPress={(selected) => setGender(selected)}
            selectedId={gender}
            layout="row"
          />
        </View>

        {/* Medical Conditions */}
        <View style={styles.inputContainer}>
          <Feather name="heart" size={24} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Medical Conditions (optional)"
            value={medicalConditions}
            onChangeText={setMedicalConditions}
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Link href="/(auth)/Login" style={styles.loginLink}>
            <Text style={styles.loginLink}>Log In</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#4A5568',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#4A5568',
    paddingVertical: 15, // Adjust padding for date picker
  },
  registerButton: {
    backgroundColor: '#2C7A7B',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#4A5568',
    fontSize: 14,
  },
  loginLink: {
    color: '#2C7A7B',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
