import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressChart } from 'react-native-chart-kit';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import QRCode from 'react-native-qrcode-svg';
import { account } from '~/services/appwrite';

const Dashboard = () => {
  const userData =
    'https://cloud.appwrite.io/v1/storage/buckets/67b9d741003a1f86baa0/files/67baae370036da9a79b3/view?project=67b9a28200344b28883b&mode=admin';
  // Convert userData to a string
  const userDataString = JSON.stringify(userData);

  // Animation values
  const notificationScale = useSharedValue(1);
  const profileScale = useSharedValue(1);

  // Notification icon animation
  const notificationStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: notificationScale.value }],
    };
  });

  // Profile icon animation
  const profileStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: profileScale.value }],
    };
  });

  // Handle notification icon press
  const [showNotifications, setShowNotifications] = useState(false);
  const handleNotificationPress = () => {
    notificationScale.value = withSpring(0.9, { damping: 2, stiffness: 200 }, () => {
      notificationScale.value = withSpring(1);
    });
    setShowNotifications(true);
  };

  // Handle profile icon press
  const handleProfilePress = () => {
    profileScale.value = withSpring(0.9, { damping: 2, stiffness: 200 }, () => {
      profileScale.value = withSpring(1);
    });
    console.log('Profile pressed');
  };

  // Dummy data for progress chart
  const progressData = {
    labels: ['Calories', 'Steps', 'Water'],
    data: [0.7, 0.4, 0.9],
  };

  // Random health notifications
  const [healthNotification, setHealthNotification] = useState('');

  // Updated Reminder interface and state
  interface Reminder {
    text: string;
    completed: boolean;
    date: Date;
    isDaily: boolean;
  }

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDaily, setIsDaily] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Add new state for symptoms
  interface Symptom {
    id: number;
    name: string;
    severity: string;
    timestamp: Date;
  }

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState('mild');
  const [showAddSymptom, setShowAddSymptom] = useState(false);

  const addSymptom = () => {
    if (newSymptom.trim() !== '') {
      const symptom = {
        id: Date.now(),
        name: newSymptom,
        severity: symptomSeverity,
        timestamp: new Date(),
      };
      setSymptoms([symptom, ...symptoms]);
      setNewSymptom('');
      setSymptomSeverity('mild');
      setShowAddSymptom(false);
    }
  };

  const getSeverityColor = (severity: 'mild' | 'moderate' | 'severe'): string => {
    switch (severity) {
      case 'mild':
        return '#48BB78';
      case 'moderate':
        return '#ECC94B';
      case 'severe':
        return '#F56565';
      default:
        return '#48BB78';
    }
  };

  const addReminder = () => {
    if (newReminder.trim() !== '') {
      setReminders([
        ...reminders,
        {
          text: newReminder,
          completed: false,
          date: selectedDate,
          isDaily,
        },
      ]);
      setNewReminder('');
      setIsDaily(false);
      setSelectedDate(new Date());
    }
  };

  const toggleReminder = (index: number) => {
    const updatedReminders = [...reminders];
    updatedReminders[index].completed = !updatedReminders[index].completed;
    setReminders(updatedReminders);
  };

  const removeReminder = (index: number) => {
    const updatedReminders = reminders.filter((_, i) => i !== index);
    setReminders(updatedReminders);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(selectedDate);
      newDate.setHours(currentTime.getHours());
      newDate.setMinutes(currentTime.getMinutes());
      setSelectedDate(newDate);
    }
  };

  useEffect(() => {
    const notifications = [
      "Don't forget to take your Vitamin D supplement today!",
      'Stay hydrated! Drink at least 2 liters of water daily.',
      'Remember to log your meals for accurate calorie tracking.',
      'Your next teleconsultation is scheduled for tomorrow at 10 AM.',
      'Take a 10-minute walk to meet your daily step goal.',
    ];

    const interval = setInterval(() => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setHealthNotification(randomNotification);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Dummy notifications for pop-up
  const notifications = [
    { id: 1, text: 'Your appointment with Dr. Smith is tomorrow at 10 AM.', time: '2 hours ago' },
    { id: 2, text: "Don't forget to take your Vitamin D supplement.", time: '5 hours ago' },
    { id: 3, text: 'Your blood test report is ready.', time: '1 day ago' },
  ];

  return (
    <LinearGradient colors={['#F0F4F8', '#E0EAFA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>MediTech</Text>
            <Text style={styles.healthNotification}>{healthNotification}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleNotificationPress}>
              <Animated.View style={[styles.notificationIcon, notificationStyle]}>
                <Feather name="bell" size={24} color="#2C7A7B" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfilePress}>
              <Animated.View style={[styles.profileIcon, profileStyle]}>
                <Image
                  source={{ uri: 'https://placekitten.com/100/100' }}
                  style={styles.profileImage}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Health Stats */}
        <View style={styles.healthStats}>
          <Text style={styles.sectionTitle}>Daily Health Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Feather name="activity" size={24} color="#2C7A7B" />
              <Text style={styles.statValue}>5,000</Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="zap" size={24} color="#2C7A7B" />
              <Text style={styles.statValue}>1,200 kcal</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="droplet" size={24} color="#2C7A7B" />
              <Text style={styles.statValue}>2.5L</Text>
              <Text style={styles.statLabel}>Water</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="moon" size={24} color="#2C7A7B" />
              <Text style={styles.statValue}>7h 30m</Text>
              <Text style={styles.statLabel}>Sleep</Text>
            </View>
          </View>
        </View>

        {/* Medical Records */}
        <View style={styles.medicalRecords}>
          <Text style={styles.sectionTitle}>Medical Records</Text>
          <View style={styles.medicalCard}>
            <Text style={styles.medicalTitle}>Blood Test Report</Text>
            <Text style={styles.medicalDetails}>Date: 20th Oct 2023</Text>
            <View style={styles.medicalActions}>
              <Link href="/(main)/medical-records" style={styles.medicalLink}>
                <Text style={styles.medicalLinkText}>View Report</Text>
              </Link>
              <TouchableOpacity style={styles.uploadButton}>
                <Feather name="upload" size={16} color="#2C7A7B" />
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.medicalCard}>
            <Text style={styles.medicalTitle}>X-Ray Report</Text>
            <Text style={styles.medicalDetails}>Date: 15th Oct 2023</Text>
            <View style={styles.medicalActions}>
              <Link href="/(main)/medical-records" style={styles.medicalLink}>
                <Text style={styles.medicalLinkText}>View Report</Text>
              </Link>
              <TouchableOpacity style={styles.uploadButton}>
                <Feather name="upload" size={16} color="#2C7A7B" />
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appointments */}
        <View style={styles.appointments}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <View style={styles.appointmentCard}>
            <Feather name="calendar" size={24} color="#2C7A7B" />
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentTitle}>Dr.Yash</Text>
              <Text style={styles.appointmentTime}>10:00 AM, 25th Oct 2023</Text>
            </View>
          </View>
          <View style={styles.appointmentCard}>
            <Feather name="calendar" size={24} color="#2C7A7B" />
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentTitle}>Dr.Sarthak</Text>
              <Text style={styles.appointmentTime}>2:00 PM, 26th Oct 2023</Text>
            </View>
          </View>
        </View>

        {/* Goal Tracking */}
        <View style={styles.goalTracking}>
          <Text style={styles.sectionTitle}>Goal Tracking</Text>
          <View style={styles.chartContainer}>
            <ProgressChart
              data={progressData}
              width={310}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(44, 122, 123, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
              }}
            />
          </View>
        </View>

        {/* Symptom Monitoring */}
        <View style={styles.symptomMonitoring}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Symptom Monitoring</Text>
            <TouchableOpacity
              style={styles.addSymptomButton}
              onPress={() => setShowAddSymptom(true)}>
              <Feather name="plus" size={24} color="#2C7A7B" />
            </TouchableOpacity>
          </View>

          {symptoms.map((symptom) => (
            <View key={symptom.id} style={styles.symptomCard}>
              <View style={styles.symptomHeader}>
                <Text style={styles.symptomTitle}>{symptom.name}</Text>
                <View
                  style={[
                    styles.severityBadge,
                    {
                      backgroundColor: getSeverityColor(
                        symptom.severity as 'mild' | 'moderate' | 'severe'
                      ),
                    },
                  ]}>
                  <Text style={styles.severityText}>
                    {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                  </Text>
                </View>
              </View>
              <Text style={styles.symptomDetails}>
                Logged:{' '}
                {new Date(symptom.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}

          {/* Add Symptom Modal */}
          <Modal
            visible={showAddSymptom}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowAddSymptom(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Add New Symptom</Text>

                <TextInput
                  style={styles.symptomInput}
                  placeholder="Enter symptom"
                  value={newSymptom}
                  onChangeText={setNewSymptom}
                />

                <Text style={styles.severityLabel}>Severity</Text>
                <View style={styles.severityButtons}>
                  {['mild', 'moderate', 'severe'].map((severity) => (
                    <TouchableOpacity
                      key={severity}
                      style={[
                        styles.severityButton,
                        symptomSeverity === severity && styles.severityButtonActive,
                        {
                          backgroundColor: getSeverityColor(
                            severity as 'mild' | 'moderate' | 'severe'
                          ),
                        },
                      ]}
                      onPress={() => setSymptomSeverity(severity)}>
                      <Text style={styles.severityButtonText}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowAddSymptom(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addButton} onPress={addSymptom}>
                    <Text style={styles.addButtonText}>Add Symptom</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>

        {/* Community Health Dashboard */}
        <View style={styles.communityHealth}>
          <Text style={styles.sectionTitle}>Community Health Dashboard</Text>
          <View style={styles.communityCard}>
            <Text style={styles.communityText}>
              Stay updated with the latest health trends in your community.
            </Text>
            <Link href="/(main)/community" style={styles.communityLink}>
              <Text style={styles.communityLinkText}>View Dashboard</Text>
            </Link>
          </View>
        </View>

        {/* Medication Reminders */}
        <View style={styles.medicationReminders}>
          <Text style={styles.sectionTitle}>Medication Reminders</Text>
          <View style={styles.medicationCard}>
            <Text style={styles.medicationTitle}>Paracetamol</Text>
            <Text style={styles.medicationDetails}>Next dose: 8:00 PM</Text>
          </View>
          <View style={styles.medicationCard}>
            <Text style={styles.medicationTitle}>Vitamin D</Text>
            <Text style={styles.medicationDetails}>Next dose: 9:00 AM</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="plus" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Log Symptom</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Link
              href={{
                pathname: '/(main)/teleconsultation',
                params: {
                  roomName: 'DemoRoom',
                  userInfo: JSON.stringify({ displayName: 'Guest User' }),
                },
              }}>
              <Feather name="play" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Start Teleconsultation</Text>
            </Link>
          </TouchableOpacity>
        </View>

        {/* Todo Reminders */}
        <View style={styles.todoReminders}>
          <Text style={styles.sectionTitle}>Todo Reminders</Text>
          <View style={styles.todoCard}>
            <TextInput
              style={styles.todoInput}
              placeholder="Add a new reminder"
              value={newReminder}
              onChangeText={setNewReminder}
            />
            <View style={styles.reminderControls}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}>
                <Feather name="calendar" size={20} color="#2C7A7B" />
                <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}>
                <Feather name="clock" size={20} color="#2C7A7B" />
                <Text style={styles.dateTimeText}>{formatTime(selectedDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.dailyButton, isDaily && styles.dailyButtonActive]}
                onPress={() => setIsDaily(!isDaily)}>
                <Feather
                  name={isDaily ? 'repeat' : 'clock'}
                  size={20}
                  color={isDaily ? '#FFFFFF' : '#2C7A7B'}
                />
                <Text style={[styles.dailyButtonText, isDaily && styles.dailyButtonTextActive]}>
                  Daily
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.addButton} onPress={addReminder}>
                <Feather name="plus" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {reminders.map((reminder, index) => (
            <View key={index} style={styles.reminderItem}>
              <TouchableOpacity onPress={() => toggleReminder(index)}>
                <Feather
                  name={reminder.completed ? 'check-square' : 'square'}
                  size={24}
                  color="#2C7A7B"
                />
              </TouchableOpacity>
              <View style={styles.reminderContent}>
                <Text style={[styles.reminderText, reminder.completed && styles.completedReminder]}>
                  {reminder.text}
                </Text>
                <View style={styles.reminderMeta}>
                  <Text style={styles.reminderDate}>
                    {formatDate(reminder.date)} at {formatTime(reminder.date)}
                  </Text>
                  {reminder.isDaily && (
                    <View style={styles.dailyTag}>
                      <Feather name="repeat" size={14} color="#2C7A7B" />
                      <Text style={styles.dailyTagText}>Daily</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => removeReminder(index)}>
                <Feather name="trash-2" size={24} color="#FF4D4D" />
              </TouchableOpacity>
            </View>
          ))}

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
        <View style={styles.containerqr}>
          <Text style={styles.title}>Your QR Code</Text>
          <View style={styles.qrCodeContainer}>
            <View style={styles.qrCodeWrapper}>
              <QRCode value={userData} size={200} color="#000000" backgroundColor="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.description}>Scan this QR code to share your details.</Text>
        </View>
      </ScrollView>

      {/* Notifications Pop-Up */}
      <Modal
        visible={showNotifications}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotifications(false)}>
        <View style={styles.notificationsModal}>
          <View style={styles.notificationsContainer}>
            <Text style={styles.notificationsTitle}>Notifications</Text>
            {notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notification.text}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowNotifications(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C7A7B',
  },
  healthNotification: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4D4D',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileIcon: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  healthStats: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C7A7B',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  medicalRecords: {
    marginBottom: 20,
  },
  medicalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  medicalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  medicalDetails: {
    fontSize: 14,
    color: '#4A5568',
  },
  medicalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  medicalLink: {
    alignSelf: 'flex-end',
  },
  medicalLinkText: {
    color: '#2C7A7B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  uploadText: {
    color: '#2C7A7B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  appointments: {
    marginBottom: 20,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentDetails: {
    marginLeft: 15,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  appointmentTime: {
    fontSize: 14,
    color: '#4A5568',
  },
  goalTracking: {
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  symptomMonitoring: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addSymptomButton: {
    padding: 5,
  },
  symptomCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  symptomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  symptomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  symptomDetails: {
    fontSize: 14,
    color: '#4A5568',
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
  },
  symptomInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  severityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  severityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  severityButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  severityButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  severityButtonActive: {
    borderWidth: 2,
    borderColor: '#2C7A7B',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2C7A7B',
  },
  cancelButtonText: {
    color: '#2C7A7B',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2C7A7B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  communityHealth: {
    marginBottom: 20,
  },
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  communityText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 10,
  },
  communityLink: {
    alignSelf: 'flex-end',
  },
  communityLinkText: {
    color: '#2C7A7B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  medicationReminders: {
    marginBottom: 20,
  },
  medicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  medicationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  medicationDetails: {
    fontSize: 14,
    color: '#4A5568',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C7A7B',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  todoReminders: {
    marginBottom: 20,
  },
  todoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  todoInput: {
    fontSize: 16,
    color: '#2D3748',
  },
  reminderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 5,
    padding: 8,
    gap: 5,
  },
  dateTimeText: {
    color: '#2C7A7B',
    fontSize: 14,
  },
  dailyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 5,
    padding: 8,
    gap: 5,
  },
  dailyButtonActive: {
    backgroundColor: '#2C7A7B',
  },
  dailyButtonText: {
    color: '#2C7A7B',
    fontSize: 14,
  },
  dailyButtonTextActive: {
    color: '#FFFFFF',
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reminderContent: {
    flex: 1,
    marginLeft: 10,
  },
  reminderText: {
    fontSize: 16,
    color: '#2D3748',
  },
  completedReminder: {
    textDecorationLine: 'line-through',
    color: '#A0AEC0',
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  reminderDate: {
    fontSize: 12,
    color: '#718096',
  },
  dailyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6FFFA',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  dailyTagText: {
    fontSize: 12,
    color: '#2C7A7B',
  },
  notificationsModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  notificationsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  notificationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  notificationItem: {
    marginBottom: 15,
  },
  notificationText: {
    fontSize: 16,
    color: '#4A5568',
  },
  notificationTime: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#2C7A7B',
    fontSize: 14,
    fontWeight: 'bold',
  },
  containerqr: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  qrCodeContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 16,
    elevation: 5, // Shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  qrCodeWrapper: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default Dashboard;
