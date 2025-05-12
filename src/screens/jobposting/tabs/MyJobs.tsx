import React, {useCallback, useEffect, useMemo} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'

import {useIsFocused, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import {
  DeleteJobAlert,
  EmptyJobList,
  JobCard,
  JobCardShimmerList,
} from '../../../components/my_jobs'

import {CompanyAppStackParamList, JobType} from '../../../constants/types'
import {getTimeAgo} from '../../../utils/dateTimeHelper'
import {STRINGS} from '../../../constants/strings'
import styles from '../../../styles/myJobs.styles'
import ErrorBoundary from '../../../components/common/ErrorBoundary'
import {useJobs} from '../../../hooks/useJobs'

type NavigationProp = NativeStackNavigationProp<CompanyAppStackParamList>

/**
 * MyJobs component - Displays the list of jobs posted by the company user
 */
const MyJobs = () => {
  const navigation = useNavigation<NavigationProp>()
  const isFocused = useIsFocused()

  // State for delete confirmation dialog
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false)
  const [jobToDelete, setJobToDelete] = React.useState<string | null>(null)

  // Use the jobs hook for job management
  const {
    jobs,
    loading,
    refreshing,
    lastUpdated,
    error,
    deleteLoading,
    fetchJobs,
    refreshJobs,
    deleteJob,
  } = useJobs()

  // Effect hook to fetch jobs when the screen is focused
  useEffect(() => {
    if (isFocused) {
      fetchJobs()
    }
  }, [isFocused, fetchJobs])

  /**
   * Opens the delete confirmation dialog
   */
  const handleDeleteJob = useCallback((jobId: string) => {
    setJobToDelete(jobId)
    setAlertVisible(true)
  }, [])

  /**
   * Navigates to the EditJob screen
   */
  const handleEditJob = useCallback(
    (job: JobType) => {
      navigation.getParent()?.navigate('EditJob', {data: job})
    },
    [navigation],
  )

  /**
   * Confirms and processes job deletion
   */
  const handleConfirmDelete = useCallback(async () => {
    if (!jobToDelete) return

    const success = await deleteJob(jobToDelete)
    if (success) {
      setAlertVisible(false)
      setJobToDelete(null)
    }
  }, [jobToDelete, deleteJob])

  /**
   * Cancels the delete operation
   */
  const handleCancelDelete = useCallback(() => {
    setAlertVisible(false)
    setJobToDelete(null)
  }, [])

  /**
   * Render function for job list items
   */
  const renderJobItem = useCallback(
    ({item}: {item: JobType}) => (
      <JobCard
        job={item}
        onEdit={() => handleEditJob(item)}
        onDelete={() => handleDeleteJob(item.id)}
      />
    ),
    [handleEditJob, handleDeleteJob],
  )

  /**
   * Memoized key extractor function to prevent unnecessary re-renders
   */
  const keyExtractor = useCallback((item: JobType) => item.id, [])

  /**
   * Memoized empty list component to prevent unnecessary re-renders
   */
  const ListEmptyComponent = useMemo(() => <EmptyJobList />, [])

  /**
   * Content component to render when jobs are loaded
   */
  const JobsContent = useMemo(
    () => (
      <View style={styles.fill}>
        <FlatList
          data={jobs}
          keyExtractor={keyExtractor}
          renderItem={renderJobItem}
          contentContainerStyle={[styles.listContainer, jobs.length === 0 && styles.screenCenter]}
          ListEmptyComponent={ListEmptyComponent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refreshJobs}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={21}
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
        />
        {lastUpdated && <Text style={styles.lastUpdatedText}>{getTimeAgo(lastUpdated)}</Text>}
      </View>
    ),
    [jobs, keyExtractor, renderJobItem, refreshing, refreshJobs, lastUpdated, ListEmptyComponent],
  )

  /**
   * Error state component
   */
  const ErrorState = useMemo(
    () =>
      error && (
        <View style={localStyles.errorContainer}>
          <Text style={localStyles.errorText}>Something went wrong</Text>
          <Text style={localStyles.errorMessage}>{error.message}</Text>
          <Text style={localStyles.retryText} onPress={() => fetchJobs(true)}>
            Tap to retry
          </Text>
        </View>
      ),
    [error, fetchJobs],
  )

  return (
    <ErrorBoundary>
      <View style={styles.screen}>
        <Text style={styles.headerTitle}>{STRINGS.appTitle}</Text>

        {loading && !refreshing ? <JobCardShimmerList /> : ErrorState || JobsContent}

        <DeleteJobAlert
          visible={alertVisible}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          loading={deleteLoading}
        />
      </View>
    </ErrorBoundary>
  )
}

// Constants for FlatList optimization
const ITEM_HEIGHT = 120 // Approximate height of a job card in dp

// Local styles for error handling
const localStyles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    fontSize: 16,
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
})

export default React.memo(MyJobs)
