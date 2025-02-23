import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ProgressChart } from 'react-native-chart-kit';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const Dashboard = () => {
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
    setShowNotifications(true); // Show notifications pop-up
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
    data: [0.7, 0.4, 0.9], // Progress values (0 to 1)
  };

  // Random health notifications
  const [healthNotification, setHealthNotification] = useState('');

  useEffect(() => {
    const notifications = [
      'Don’t forget to take your Vitamin D supplement today!',
      'Stay hydrated! Drink at least 2 liters of water daily.',
      'Remember to log your meals for accurate calorie tracking.',
      'Your next teleconsultation is scheduled for tomorrow at 10 AM.',
      'Take a 10-minute walk to meet your daily step goal.',
    ];

    // Set a random notification every 10 seconds
    const interval = setInterval(() => {
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setHealthNotification(randomNotification);
    }, 10000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Dummy notifications for pop-up
  const notifications = [
    { id: 1, text: 'Your appointment with Dr. Smith is tomorrow at 10 AM.', time: '2 hours ago' },
    { id: 2, text: 'Don’t forget to take your Vitamin D supplement.', time: '5 hours ago' },
    { id: 3, text: 'Your blood test report is ready.', time: '1 day ago' },
  ];

  return (
    <LinearGradient colors={['#F0F4F8', '#E0EAFA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>HealthHub</Text>
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
                  source={{ uri: 'https://placekitten.com/100/100' }} // Replace with user profile picture
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
              <Text style={styles.appointmentTitle}>Dr. Smith</Text>
              <Text style={styles.appointmentTime}>10:00 AM, 25th Oct 2023</Text>
            </View>
          </View>
          <View style={styles.appointmentCard}>
            <Feather name="calendar" size={24} color="#2C7A7B" />
            <View style={styles.appointmentDetails}>
              <Text style={styles.appointmentTitle}>Dr. Johnson</Text>
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
              width={350} // Increased width
              height={200}
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
          <Text style={styles.sectionTitle}>Symptom Monitoring</Text>
          <View style={styles.symptomCard}>
            <Text style={styles.symptomTitle}>Headache</Text>
            <Text style={styles.symptomDetails}>Logged: 2 hours ago</Text>
          </View>
          <View style={styles.symptomCard}>
            <Text style={styles.symptomTitle}>Fatigue</Text>
            <Text style={styles.symptomDetails}>Logged: 5 hours ago</Text>
          </View>
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
            <Feather name="play" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>Start Teleconsultation</Text>
          </TouchableOpacity>
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
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  symptomMonitoring: {
    marginBottom: 20,
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
  symptomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  symptomDetails: {
    fontSize: 14,
    color: '#4A5568',
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
});

export default Dashboard;
