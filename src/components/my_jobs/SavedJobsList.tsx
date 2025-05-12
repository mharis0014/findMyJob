import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native'
import {scale, verticalScale} from 'react-native-size-matters'
import firestore from '@react-native-firebase/firestore'

import {JobType} from '../../constants/types'
import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'
import LocalStorage from '../../utils/localStorage'
import {showToast} from '../../utils/toast'

const SavedJobsList = ({navigation}: any) => {
  const [savedJobs, setSavedJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSavedJobs = useCallback(async () => {
    try {
      setLoading(true)
      const userId = await LocalStorage.getItem('userId')

      if (!userId) {
        throw new Error('User not logged in')
      }

      // Get saved job IDs from user_favorites collection
      const favoritesSnapshot = await firestore()
        .collection('user_favorites')
        .where('userId', '==', userId)
        .get()

      if (favoritesSnapshot.empty) {
        setSavedJobs([])
        return
      }

      // Extract job IDs
      const jobIds = favoritesSnapshot.docs.map(doc => doc.data().jobId)

      // Fetch job details for each saved job
      const jobPromises = jobIds.map(jobId => firestore().collection('jobs').doc(jobId).get())

      const jobDocs = await Promise.all(jobPromises)

      // Map results to job objects, filtering out any that no longer exist
      const jobs = jobDocs
        .filter(doc => doc.exists)
        .map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<JobType, 'id'>),
        }))

      setSavedJobs(jobs)
    } catch (error) {
      console.error('Error fetching saved jobs:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load saved jobs',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const removeSavedJob = useCallback(async (jobId: string) => {
    try {
      const userId = await LocalStorage.getItem('userId')

      if (!userId) {
        throw new Error('User not logged in')
      }

      // Find the favorite document to delete
      const favoriteSnapshot = await firestore()
        .collection('user_favorites')
        .where('userId', '==', userId)
        .where('jobId', '==', jobId)
        .get()

      if (favoriteSnapshot.empty) {
        throw new Error('Saved job not found')
      }

      // Delete the favorite document
      await firestore().collection('user_favorites').doc(favoriteSnapshot.docs[0].id).delete()

      // Update local state by removing the job
      setSavedJobs(prev => prev.filter(job => job.id !== jobId))

      showToast({
        type: 'success',
        title: 'Removed',
        message: 'Job removed from saved jobs',
      })
    } catch (error) {
      console.error('Error removing saved job:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to remove saved job',
      })
    }
  }, [])

  const handleJobPress = useCallback(
    (job: JobType) => {
      navigation.navigate('JobDetails', {jobId: job.id})
    },
    [navigation],
  )

  const confirmRemove = useCallback(
    (jobId: string, jobTitle: string) => {
      Alert.alert(
        'Remove Saved Job',
        `Are you sure you want to remove "${jobTitle}" from your saved jobs?`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Remove',
            onPress: () => removeSavedJob(jobId),
            style: 'destructive',
          },
        ],
      )
    },
    [removeSavedJob],
  )

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    fetchSavedJobs()
  }, [fetchSavedJobs])

  useEffect(() => {
    fetchSavedJobs()
  }, [fetchSavedJobs])

  if (loading && !refreshing && savedJobs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobs}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.jobCard}
            onPress={() => handleJobPress(item)}
            activeOpacity={0.7}>
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle} numberOfLines={1}>
                {item.jobTitle}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => confirmRemove(item.id, item.jobTitle)}>
                <Image source={ICONS.trash} style={styles.removeIcon} />
              </TouchableOpacity>
            </View>

            <Text style={styles.companyText} numberOfLines={1}>
              {item.company || 'Company'}
            </Text>

            <Text style={styles.salaryText}>{item.salaryPackage}</Text>

            <Text style={styles.descriptionText} numberOfLines={2}>
              {item.jobDesc}
            </Text>

            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.category}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.skill}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image source={ICONS.bookmarkEmpty} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No Saved Jobs</Text>
            <Text style={styles.emptyText}>Jobs you save will appear here for easy access</Text>
          </View>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: scale(16),
    paddingBottom: verticalScale(20),
  },
  jobCard: {
    backgroundColor: colors.white,
    borderRadius: scale(10),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: scale(16),
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    marginRight: scale(10),
  },
  removeButton: {
    padding: scale(4),
  },
  removeIcon: {
    width: scale(20),
    height: scale(20),
    tintColor: colors.error,
  },
  companyText: {
    fontSize: scale(14),
    color: colors.textSecondary,
    marginTop: verticalScale(4),
  },
  salaryText: {
    fontSize: scale(15),
    fontWeight: '600',
    color: colors.primary,
    marginTop: verticalScale(8),
  },
  descriptionText: {
    fontSize: scale(14),
    color: colors.textSecondary,
    marginTop: verticalScale(8),
    lineHeight: scale(20),
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(12),
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.primaryLight || '#e6f2ff',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(6),
    marginRight: scale(8),
    marginBottom: verticalScale(4),
  },
  tagText: {
    fontSize: scale(12),
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(50),
  },
  emptyIcon: {
    width: scale(80),
    height: scale(80),
    tintColor: colors.textSecondary,
    marginBottom: verticalScale(16),
  },
  emptyTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: verticalScale(8),
  },
  emptyText: {
    fontSize: scale(14),
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: scale(32),
  },
})

export default SavedJobsList
