import {useState, useCallback} from 'react'
import firestore from '@react-native-firebase/firestore'

import {JobType} from '../constants/types'
import LocalStorage from '../utils/localStorage'
import {showToast} from '../utils/toast'
import Performance from '../utils/performance'

// Constants with semantic naming
const JOB_CACHE = {
  NAMESPACE: 'jobs',
  KEY: 'company_jobs',
  DURATION: 15 * 60 * 1000, // 15 minutes
}

/**
 * Custom hook for managing job operations
 */
export const useJobs = () => {
  // State
  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  /**
   * Fetches jobs from Firestore and updates local state
   * @param forceRefresh Force a refresh from the server instead of using cache
   */
  const fetchJobs = useCallback(async (forceRefresh = false) => {
    return Performance.measureAsync(
      async () => {
        try {
          setLoading(true)
          setError(null)

          // Get user ID once for the query
          const userId = await LocalStorage.getItem('userId')
          if (!userId) {
            throw new Error('User ID not found')
          }

          // Use cached jobs if not forcing refresh and cache hasn't expired
          if (
            !forceRefresh &&
            !LocalStorage.hasNamespacedCacheExpired(JOB_CACHE.NAMESPACE, JOB_CACHE.KEY)
          ) {
            const cachedJobs = LocalStorage.getCachedNamespacedItem<JobType[]>(
              JOB_CACHE.NAMESPACE,
              JOB_CACHE.KEY,
            )
            if (cachedJobs && cachedJobs.length > 0) {
              setJobs(cachedJobs)
              setLoading(false)
              setLastUpdated(new Date())
              return
            }
          }

          // Fetch fresh data from Firestore with query optimization
          const jobsRef = firestore().collection('jobs')
          const query = jobsRef
            .where('postedBy', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(50) // Limit for performance

          const snapshot = await query.get()

          const jobsList: JobType[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<JobType, 'id'>),
          }))

          setJobs(jobsList)

          // Store with cache expiration
          if (jobsList.length > 0) {
            LocalStorage.setCachedNamespacedItem(
              JOB_CACHE.NAMESPACE,
              JOB_CACHE.KEY,
              jobsList,
              JOB_CACHE.DURATION,
            )
          }

          setLastUpdated(new Date())
        } catch (err) {
          console.error('[useJobs] fetchJobs error:', err)
          setError(err instanceof Error ? err : new Error('Unknown error occurred'))
          showToast({
            type: 'error',
            title: 'Failed to load jobs',
            message: 'Please try again later',
          })
          throw err // Re-throw for performance tracking
        } finally {
          setLoading(false)
          setRefreshing(false)
        }
      },
      'fetchJobs',
      {forceRefresh},
    )
  }, [])

  /**
   * Pull-to-refresh handler
   */
  const refreshJobs = useCallback(async () => {
    setRefreshing(true)
    await fetchJobs(true) // Force refresh from server
  }, [fetchJobs])

  /**
   * Deletes a job from Firestore
   */
  const deleteJob = useCallback(
    async (jobId: string) => {
      return Performance.measureAsync(
        async () => {
          try {
            setDeleteLoading(true)
            await firestore().collection('jobs').doc(jobId).delete()

            // Update local jobs list without refetching
            const updatedJobs = jobs.filter(job => job.id !== jobId)
            setJobs(updatedJobs)

            // Update the cache with new job list
            LocalStorage.setCachedNamespacedItem(
              JOB_CACHE.NAMESPACE,
              JOB_CACHE.KEY,
              updatedJobs,
              JOB_CACHE.DURATION,
            )

            showToast({
              type: 'success',
              title: 'Job Deleted',
              message: 'The job posting has been removed successfully',
            })

            return true
          } catch (err) {
            console.error('[useJobs] deleteJob error:', err)
            showToast({
              type: 'error',
              title: 'Delete Failed',
              message: 'Unable to delete job. Please try again.',
            })
            return false
          } finally {
            setDeleteLoading(false)
          }
        },
        'deleteJob',
        {jobId},
      )
    },
    [jobs],
  )

  /**
   * Adds a new job to the jobs array (optimistic update)
   */
  const addJobToList = useCallback(
    (job: JobType) => {
      Performance.logExecutionTime('addJobToList', 0, true)

      const updatedJobs = [job, ...jobs]
      setJobs(updatedJobs)

      // Update cache
      LocalStorage.setCachedNamespacedItem(
        JOB_CACHE.NAMESPACE,
        JOB_CACHE.KEY,
        updatedJobs,
        JOB_CACHE.DURATION,
      )
    },
    [jobs],
  )

  /**
   * Updates a job in the jobs array (optimistic update)
   */
  const updateJobInList = useCallback(
    (updatedJob: JobType) => {
      Performance.logExecutionTime('updateJobInList', 0, true)

      const updatedJobs = jobs.map(job => (job.id === updatedJob.id ? updatedJob : job))

      setJobs(updatedJobs)

      // Update cache
      LocalStorage.setCachedNamespacedItem(
        JOB_CACHE.NAMESPACE,
        JOB_CACHE.KEY,
        updatedJobs,
        JOB_CACHE.DURATION,
      )
    },
    [jobs],
  )

  /**
   * Clears the job cache
   */
  const clearJobCache = useCallback(() => {
    LocalStorage.removeNamespacedItem(JOB_CACHE.NAMESPACE, JOB_CACHE.KEY)
  }, [])

  return {
    jobs,
    loading,
    refreshing,
    lastUpdated,
    error,
    deleteLoading,
    fetchJobs,
    refreshJobs,
    deleteJob,
    addJobToList,
    updateJobInList,
    clearJobCache,
  }
}
