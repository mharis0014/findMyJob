import React, {useState, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native'
import {useFocusEffect} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import {useApplications} from '../../../hooks/useApplications'
import {useJobRecommendations} from '../../../hooks/useJobRecommendations'
import {useJobs} from '../../../hooks/useJobs'
import {useProfileStore} from '../../../utils/stateManagement'
import {COLORS} from '../../../constants/theme'
import AddJobApplication from '../../../components/application/AddJobApplication'
import {UserBottomTabParamList} from '../../../constants/types'

// Define the navigation prop type
type DashboardNavigationProp = NativeStackNavigationProp<UserBottomTabParamList, 'Home'>

interface Props {
  navigation: DashboardNavigationProp
}

const DashboardScreen = ({navigation}: Props) => {
  const {profile} = useProfileStore()

  // State
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // Hooks
  const {applications, stats, refreshApplications} = useApplications()
  const {jobs: savedJobs, loading: jobsLoading, fetchJobs} = useJobs()
  const {
    recommendations,
    loading: recommendationsLoading,
    fetchRecommendations,
  } = useJobRecommendations()

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshData()
    }, []),
  )

  // Refresh all data
  const refreshData = async () => {
    setRefreshing(true)
    Promise.all([refreshApplications(), fetchJobs(), fetchRecommendations()]).finally(() => {
      setRefreshing(false)
    })
  }

  // Get the most recent applications
  const recentApplications = applications.slice(0, 3)

  // Get top recommendations
  const topRecommendations = recommendations.slice(0, 3)

  // Placeholder for navigation - in the actual app these would be defined in the navigation stack
  const navigateToScreen = (screenName: string, params?: any) => {
    console.log(`Navigate to ${screenName} with params:`, params)
    // This is a placeholder for actual navigation
    // navigation.navigate(screenName, params)
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshData} />}>
      {/* User Welcome Section */}
      <View style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <Text style={styles.greeting}>Good {getGreeting()},</Text>
          <Text style={styles.userName}>{profile?.name || 'Job Seeker'}</Text>
          <Text style={styles.subtitle}>Here's your job search overview</Text>
        </View>

        {profile?.profileImage ? (
          <Image source={{uri: profile.profileImage}} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.profilePlaceholderText}>{getInitials(profile?.name || 'JS')}</Text>
          </View>
        )}
      </View>

      {/* Job Application Summary */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Application Summary</Text>
          <TouchableOpacity
            onPress={() => navigateToScreen('ApplicationTracker')}
            style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, {borderColor: COLORS.primary}]}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>

          <View style={[styles.statCard, {borderColor: '#9b59b6'}]}>
            <Text style={styles.statNumber}>{stats.interview || 0}</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>

          <View style={[styles.statCard, {borderColor: '#2ecc71'}]}>
            <Text style={styles.statNumber}>{stats.offer || 0}</Text>
            <Text style={styles.statLabel}>Offers</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowAddModal(true)}>
            <Text style={styles.actionText}>Add Application</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateToScreen('JobSearch')}>
            <Text style={styles.actionText}>Find Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigateToScreen('SavedJobs')}>
            <Text style={styles.actionText}>Saved Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Applications */}
      {recentApplications.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Applications</Text>
            <TouchableOpacity
              onPress={() => navigateToScreen('ApplicationTracker')}
              style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentApplications.map(app => (
            <TouchableOpacity
              key={app.id}
              style={styles.applicationCard}
              onPress={() => navigateToScreen('ApplicationDetail', {applicationId: app.id})}>
              <View style={styles.applicationHeader}>
                <Text style={styles.jobTitle} numberOfLines={1}>
                  {app.jobTitle}
                </Text>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusText}>{app.status}</Text>
                </View>
              </View>
              <Text style={styles.companyName}>{app.company}</Text>
              <Text style={styles.dateText}>Applied on {formatDate(app.appliedDate)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Job Recommendations */}
      {topRecommendations.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity
              onPress={() => navigateToScreen('JobRecommendations')}
              style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {topRecommendations.map(job => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => navigateToScreen('JobDetail', {jobId: job.id})}>
              <View style={styles.jobContent}>
                <Text style={styles.jobTitle} numberOfLines={1}>
                  {job.jobTitle}
                </Text>
                <Text style={styles.jobDetail}>{job.category}</Text>
                <Text style={styles.jobDetail}>{job.salaryPackage}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Saved Jobs */}
      {savedJobs.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Jobs</Text>
            <TouchableOpacity
              onPress={() => navigateToScreen('SavedJobs')}
              style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {savedJobs.slice(0, 3).map(job => (
            <TouchableOpacity
              key={job.id}
              style={styles.jobCard}
              onPress={() => navigateToScreen('JobDetail', {jobId: job.id})}>
              <View style={styles.jobContent}>
                <Text style={styles.jobTitle} numberOfLines={1}>
                  {job.jobTitle}
                </Text>
                <Text style={styles.jobDetail}>{job.skill}</Text>
                <Text style={styles.jobDetail}>{job.salaryPackage}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Add Application Modal */}
      <AddJobApplication
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={refreshApplications}
      />
    </ScrollView>
  )
}

// Helper function to get the greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Helper function to format date
const formatDate = (date: any): string => {
  if (!date) return 'Unknown'

  try {
    // Handle Firestore timestamp
    if (date.toDate && typeof date.toDate === 'function') {
      return new Date(date.toDate()).toLocaleDateString()
    }
    // Handle regular date object or string
    return new Date(date).toLocaleDateString()
  } catch (e) {
    return 'Invalid date'
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#333333',
    marginLeft: 4,
  },
  applicationCard: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#E8F4FD',
  },
  statusText: {
    fontSize: 12,
    color: COLORS.primary,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    maxWidth: '70%',
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
  },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  jobContent: {
    flex: 1,
  },
  jobDetail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
})

export default DashboardScreen
