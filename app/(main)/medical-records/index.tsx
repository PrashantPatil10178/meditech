import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { storage, ID, databases } from '../../../services/appwrite';

const UploadMedicalRecordsScreen = () => {
  const [recordType, setRecordType] = useState('');
  const [recordDate, setRecordDate] = useState('');
  const [recordDescription, setRecordDescription] = useState('');
  const [file, setFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle file upload
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
      });

      if (result.assets) {
        setFile(result.assets[0]);
        console.log('Selected file:', result.assets[0]);
        Alert.alert('Success', 'File selected successfully!');
      } else {
        Alert.alert('Error', 'File selection canceled or failed.');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      Alert.alert('Error', 'An error occurred while selecting the file.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!recordType || !recordDate || !file) {
      Alert.alert('Error', 'Please fill in all required fields and upload a file.');
      return;
    }

    setIsLoading(true);

    try {
      const responsefile = await fetch(file.uri);
      const blob = await responsefile.blob();

      const fileObject = new File([blob], file.name, { type: blob.type });

      const response = await storage.createFile(
        '67b9d741003a1f86baa0',
        ID.unique(),
        file,
        undefined
      );

      if (response.$id) {
        // File uploaded successfully, now save the record details
        const fileUrl = `https://cloud.appwrite.io/v1/storage/buckets/67b9d741003a1f86baa0/files/${response.$id}/view`; // Replace with your bucket ID

        // Save record details in the database
        const userId = ID; // Replace with the actual user ID (e.g., from Appwrite Account service)
        const recordData = {
          userId,
          recordType,
          recordDate,
          recordDescription,
          fileUrl,
        };

        const databaseResponse = await databases.createDocument(
          '67ba6d7200004ec7863d',
          '67ba6d88003018c91105',
          ID.unique(),
          recordData
        );

        if (databaseResponse.$id) {
          Alert.alert('Success', 'Medical record uploaded and saved successfully!');
        } else {
          Alert.alert('Error', 'Failed to save record details. Please try again.');
        }
      } else {
        Alert.alert('Error', 'File upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file or saving record:', error);
      Alert.alert('Error', 'An error occurred while uploading the file or saving the record.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#F0F4F8', '#E0EAFA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Record Type */}
        <View style={styles.inputContainer}>
          <Feather name="file-text" size={24} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Record Type (e.g., Blood Test, X-Ray)"
            placeholderTextColor="#A0AEC0"
            value={recordType}
            onChangeText={setRecordType}
          />
        </View>

        {/* Record Date */}
        <View style={styles.inputContainer}>
          <Feather name="calendar" size={24} color="#4A5568" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Record Date (e.g., 25th Oct 2023)"
            placeholderTextColor="#A0AEC0"
            value={recordDate}
            onChangeText={setRecordDate}
          />
        </View>

        {/* Record Description */}
        <View style={styles.inputContainer}>
          <Feather name="edit" size={24} color="#4A5568" style={styles.icon} />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Record Description (optional)"
            placeholderTextColor="#A0AEC0"
            value={recordDescription}
            onChangeText={setRecordDescription}
            multiline
          />
        </View>

        {/* File Upload */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
          <Feather name="upload" size={24} color="#2C7A7B" />
          <Text style={styles.uploadButtonText}>
            {file ? file.name : 'Upload File (PDF, Image, Document)'}
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Upload Medical Record</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
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
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  uploadButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4A5568',
  },
  submitButton: {
    backgroundColor: '#2C7A7B',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UploadMedicalRecordsScreen;
