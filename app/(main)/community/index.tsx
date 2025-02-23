import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, LineChart } from 'react-native-chart-kit';

const CommunityDashboard = () => {
  // Dummy data for disease spread
  const diseaseData = {
    labels: ['Flu', 'Covid', 'Allergies', 'Cold'],
    datasets: [
      {
        data: [20, 15, 25, 18],
      },
    ],
  };

  // Dummy data for weekly activity trends
  const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [8000, 12000, 9000, 15000, 10000, 13000, 11000],
      },
    ],
  };

  // Top walkers data
  const topWalkers = [
    {
      id: 1,
      name: 'Aarav Sharma',
      steps: 15234,
      avatar: 'https://images.unsplash.com/photo-1532073150508-0c1df022bdd1', // Indian male
    },
    {
      id: 2,
      name: 'Priya Patel',
      steps: 14567,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2', // Indian female
    },
    {
      id: 3,
      name: 'Rohan Verma',
      steps: 13890,
      avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006', // Indian male
    },
  ];

  // Health alerts
  const healthAlerts = [
    {
      id: 1,
      type: 'High Risk',
      title: 'Air Quality Alert',
      description: 'Poor air quality detected in downtown area. Consider wearing masks.',
      icon: 'alert-triangle' as 'alert-triangle',
    },
    {
      id: 2,
      type: 'Warning',
      title: 'Flu Season Peak',
      description: 'Increased flu cases reported. Get your flu shot today.',
      icon: 'thermometer' as 'thermometer',
    },
    {
      id: 3,
      type: 'Information',
      title: 'Pollen Count',
      description: 'High pollen levels expected this week. Take precautions if allergic.',
      icon: 'info' as 'info',
    },
  ];

  return (
    <LinearGradient colors={['#F0F4F8', '#E0EAFA']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Health</Text>
          <Text style={styles.headerSubtitle}>Stay informed about your community's health</Text>
        </View>

        {/* Disease Spread Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disease Spread</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={diseaseData}
              width={340}
              height={220}
              yAxisLabel="%"
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(44, 122, 123, ${opacity})`,
                labelColor: () => '#2D3748',
                style: {
                  borderRadius: 16,
                },
              }}
              style={styles.chart}
            />
          </View>
        </View>

        {/* Top Walkers Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Walkers</Text>
          {topWalkers.map((walker, index) => (
            <View key={walker.id} style={styles.walkerCard}>
              <View style={styles.walkerInfo}>
                <Image source={{ uri: walker.avatar }} style={styles.walkerAvatar} />
                <View style={styles.walkerDetails}>
                  <Text style={styles.walkerName}>{walker.name}</Text>
                  <Text style={styles.walkerSteps}>
                    {walker.steps.toLocaleString()} steps today
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.rankBadge,
                  {
                    backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                  },
                ]}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Activity Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Activity Trends</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={activityData}
              width={340}
              height={220}
              yAxisLabel=""
              yAxisSuffix=" steps"
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(44, 122, 123, ${opacity})`,
                labelColor: () => '#2D3748',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#2C7A7B',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Health Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Alerts</Text>
          {healthAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View
                style={[
                  styles.alertIcon,
                  {
                    backgroundColor:
                      alert.type === 'High Risk'
                        ? '#FED7D7'
                        : alert.type === 'Warning'
                          ? '#FEEBC8'
                          : '#E6FFFA',
                  },
                ]}>
                <Feather
                  name={alert.icon}
                  size={24}
                  color={
                    alert.type === 'High Risk'
                      ? '#E53E3E'
                      : alert.type === 'Warning'
                        ? '#DD6B20'
                        : '#2C7A7B'
                  }
                />
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text
                    style={[
                      styles.alertType,
                      {
                        color:
                          alert.type === 'High Risk'
                            ? '#E53E3E'
                            : alert.type === 'Warning'
                              ? '#DD6B20'
                              : '#2C7A7B',
                      },
                    ]}>
                    {alert.type}
                  </Text>
                </View>
                <Text style={styles.alertDescription}>{alert.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Community Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="message-square" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Join Discussion</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="share-2" size={24} color="#FFFFFF" />
              <Text style={styles.actionText}>Share Report</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#4A5568',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  walkerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  walkerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walkerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  walkerDetails: {
    marginLeft: 15,
  },
  walkerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  walkerSteps: {
    fontSize: 14,
    color: '#4A5568',
  },
  rankBadge: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  alertIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  alertType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertDescription: {
    fontSize: 14,
    color: '#4A5568',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C7A7B',
    borderRadius: 12,
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
});

export default CommunityDashboard;
