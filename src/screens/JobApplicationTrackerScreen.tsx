import React, {useState, useCallback} from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {useFocusEffect} from '@react-navigation/native'
import {Timestamp} from '@react-native-firebase/firestore'

import {useApplications} from '../hooks/useApplications'
import {JobApplication, ApplicationStatus} from '../constants/types'
import {COLORS} from '../constants/theme'
import {colors} from '../constants/colors'

const statusColors = {
  applied: '#3498db', // Blue
  screening: '#f39c12', // Orange
  interview: '#9b59b6', // Purple
  offer: '#2ecc71', // Green
  rejected: '#e74c3c', // Red
  withdrawn: '#95a5a6', // Gray
}

const statusIcons = {
  applied: 'file-send-outline',
  screening: 'text-search',
  interview: 'account-tie',
  offer: 'hand-coin',
  rejected: 'close-circle-outline',
  withdrawn: 'undo-variant',
}

const formatDate = (date: Date | Timestamp | null): string => {
  if (!date) return ''

  if ('toDate' in date && typeof date.toDate === 'function') {
    return new Date(date.toDate()).toLocaleDateString()
  }
  return (date as Date).toLocaleDateString()
}

const JobApplicationTrackerScreen = () => {
  const {applications, loading, refreshing, stats, refreshApplications} = useApplications()

  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')

  // Refresh applications when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshApplications()
    }, [refreshApplications]),
  )

  const handleFilterPress = (newFilter: ApplicationStatus | 'all') => {
    setFilter(newFilter)
  }

  const handleApplicationPress = (application: JobApplication) => {
    // Navigate to application detail screen
    // navigation.navigate('ApplicationDetail', {applicationId: application.id})
    console.log('Navigate to application details:', application.id)
  }

  const filteredApplications =
    filter === 'all' ? applications : applications.filter(app => app.status === filter)

  const renderApplicationItem = ({item}: {item: JobApplication}) => {
    const statusColor = statusColors[item.status as keyof typeof statusColors] || '#95a5a6'
    const statusIcon = statusIcons[item.status as keyof typeof statusIcons] || 'help-circle-outline'

    return (
      <TouchableOpacity style={styles.applicationCard} onPress={() => handleApplicationPress(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {item.jobTitle}
          </Text>
          <View style={[styles.statusBadge, {backgroundColor: statusColor}]}>
            <Icon name={statusIcon} size={14} color="#FFFFFF" />
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.companyName}>{item.company}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>Applied on {formatDate(item.appliedDate)}</Text>

          {item.interviewDate && (
            <View style={styles.interviewTag}>
              <Icon name="calendar-clock" size={14} color={COLORS.primary} />
              <Text style={styles.interviewText}>Interview: {formatDate(item.interviewDate)}</Text>
            </View>
          )}

          <Icon name="chevron-right" size={20} color="#95a5a6" />
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="file-search-outline" size={60} color="#95a5a6" />
      <Text style={styles.emptyText}>No applications found</Text>
      <Text style={styles.emptySubtext}>
        {filter === 'all'
          ? 'Start tracking your job applications'
          : `No applications with '${filter}' status`}
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => console.log('Navigate to add application')}>
        <Text style={styles.addButtonText}>Add Application</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            {title: 'Total', count: stats.total, color: '#34495e', key: 'all'},
            {title: 'Applied', count: stats.applied, color: statusColors.applied, key: 'applied'},
            {
              title: 'Screening',
              count: stats.screening,
              color: statusColors.screening,
              key: 'screening',
            },
            {
              title: 'Interview',
              count: stats.interview,
              color: statusColors.interview,
              key: 'interview',
            },
            {title: 'Offers', count: stats.offer, color: statusColors.offer, key: 'offer'},
            {
              title: 'Rejected',
              count: stats.rejected,
              color: statusColors.rejected,
              key: 'rejected',
            },
          ]}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.statCard,
                {borderColor: item.color},
                filter === item.key && {backgroundColor: item.color},
              ]}
              onPress={() => handleFilterPress(item.key as ApplicationStatus | 'all')}>
              <Text
                style={[
                  styles.statCount,
                  {color: item.color},
                  filter === item.key && {color: colors.white},
                ]}>
                {item.count}
              </Text>
              <Text style={[styles.statTitle, filter === item.key && {color: colors.white}]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter by Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterChip, filter === 'all' && styles.activeFilterChip]}
            onPress={() => handleFilterPress('all')}>
            <Text style={[styles.filterChipText, filter === 'all' && styles.activeFilterChipText]}>
              All
            </Text>
          </TouchableOpacity>
          {Object.keys(statusColors).map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                filter === status && styles.activeFilterChip,
                filter === status && {
                  backgroundColor: statusColors[status as keyof typeof statusColors],
                },
              ]}
              onPress={() => handleFilterPress(status as ApplicationStatus)}>
              <Icon
                name={statusIcons[status as keyof typeof statusIcons]}
                size={14}
                color={filter === status ? '#FFFFFF' : '#666666'}
                style={styles.filterChipIcon}
              />
              <Text
                style={[styles.filterChipText, filter === status && styles.activeFilterChipText]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Applications List */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading applications...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredApplications}
          keyExtractor={item => item.id}
          renderItem={renderApplicationItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshApplications}
              colors={[COLORS.primary]}
            />
          }
        />
      )}

      {/* Add Application FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => console.log('Navigate to add application')}>
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  statsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  statCard: {
    width: 100,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  filterContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterChipIcon: {
    marginRight: 4,
  },
  filterChipText: {
    color: '#666666',
    fontSize: 13,
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // Space for FAB
  },
  applicationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
  },
  interviewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  interviewText: {
    fontSize: 11,
    color: COLORS.primary,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
})

export default JobApplicationTrackerScreen
