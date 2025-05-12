import {useState, useEffect, useCallback} from 'react'
import firestore from '@react-native-firebase/firestore'

import {JobApplication, ApplicationStatus} from '../constants/types'
import LocalStorage from '../utils/localStorage'
import {showToast} from '../utils/toast'

/**
 * Custom hook for managing job applications
 */
export const useApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    screening: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  })

  /**
   * Fetch user's job applications
   */
  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      const userId = await LocalStorage.getItem('userId')

      if (!userId) {
        throw new Error('User ID not found')
      }

      const snapshot = await firestore()
        .collection('applications')
        .where('userId', '==', userId)
        .orderBy('appliedDate', 'desc')
        .get()

      const applicationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<JobApplication, 'id'>),
      }))

      setApplications(applicationsList)

      // Calculate stats
      const newStats = {
        total: applicationsList.length,
        applied: applicationsList.filter(app => app.status === 'applied').length,
        screening: applicationsList.filter(app => app.status === 'screening').length,
        interview: applicationsList.filter(app => app.status === 'interview').length,
        offer: applicationsList.filter(app => app.status === 'offer').length,
        rejected: applicationsList.filter(app => app.status === 'rejected').length,
        withdrawn: applicationsList.filter(app => app.status === 'withdrawn').length,
      }

      setStats(newStats)
    } catch (error) {
      console.error('[useApplications] Error fetching applications:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to load job applications',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  /**
   * Add a new job application
   */
  const addApplication = useCallback(
    async (jobData: Omit<JobApplication, 'id' | 'userId' | 'appliedDate' | 'lastUpdated'>) => {
      try {
        const userId = await LocalStorage.getItem('userId')

        if (!userId) {
          throw new Error('User ID not found')
        }

        const now = firestore.FieldValue.serverTimestamp()

        const applicationData = {
          ...jobData,
          userId,
          status: jobData.status || 'applied',
          appliedDate: now,
          lastUpdated: now,
        }

        const docRef = await firestore().collection('applications').add(applicationData)

        const newApplication: JobApplication = {
          id: docRef.id,
          ...applicationData,
          appliedDate: new Date(),
          lastUpdated: new Date(),
        }

        // Update local state
        setApplications(prev => [newApplication, ...prev])

        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          [jobData.status || 'applied']:
            prev[jobData.status || ('applied' as keyof typeof prev)] + 1,
        }))

        showToast({
          type: 'success',
          title: 'Application Added',
          message: 'Job application tracked successfully',
        })

        return docRef.id
      } catch (error) {
        console.error('[useApplications] Error adding application:', error)
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to track job application',
        })
        return null
      }
    },
    [],
  )

  /**
   * Update an existing job application
   */
  const updateApplication = useCallback(
    async (
      applicationId: string,
      updates: Partial<Omit<JobApplication, 'id' | 'userId' | 'appliedDate'>>,
    ) => {
      try {
        const userId = await LocalStorage.getItem('userId')

        if (!userId) {
          throw new Error('User ID not found')
        }

        // Find the application in our state
        const oldApplication = applications.find(app => app.id === applicationId)

        if (!oldApplication) {
          throw new Error('Application not found')
        }

        // Ensure the user owns this application
        if (oldApplication.userId !== userId) {
          throw new Error('Unauthorized to update this application')
        }

        const updateData = {
          ...updates,
          lastUpdated: firestore.FieldValue.serverTimestamp(),
        }

        await firestore().collection('applications').doc(applicationId).update(updateData)

        // Update the local state
        const updatedApplications = applications.map(app => {
          if (app.id === applicationId) {
            return {
              ...app,
              ...updates,
              lastUpdated: new Date(),
            }
          }
          return app
        })

        setApplications(updatedApplications)

        // Update stats if status changed
        if (updates.status && updates.status !== oldApplication.status) {
          setStats(prev => ({
            ...prev,
            [oldApplication.status]: prev[oldApplication.status as keyof typeof prev] - 1,
            [updates.status]: prev[updates.status as keyof typeof prev] + 1,
          }))
        }

        showToast({
          type: 'success',
          title: 'Application Updated',
          message: 'Job application updated successfully',
        })

        return true
      } catch (error) {
        console.error('[useApplications] Error updating application:', error)
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to update job application',
        })
        return false
      }
    },
    [applications],
  )

  /**
   * Delete a job application
   */
  const deleteApplication = useCallback(
    async (applicationId: string) => {
      try {
        const userId = await LocalStorage.getItem('userId')

        if (!userId) {
          throw new Error('User ID not found')
        }

        // Find the application in our state
        const application = applications.find(app => app.id === applicationId)

        if (!application) {
          throw new Error('Application not found')
        }

        // Ensure the user owns this application
        if (application.userId !== userId) {
          throw new Error('Unauthorized to delete this application')
        }

        await firestore().collection('applications').doc(applicationId).delete()

        // Update local state
        const updatedApplications = applications.filter(app => app.id !== applicationId)
        setApplications(updatedApplications)

        // Update stats
        setStats(prev => ({
          ...prev,
          total: prev.total - 1,
          [application.status]: prev[application.status as keyof typeof prev] - 1,
        }))

        showToast({
          type: 'success',
          title: 'Application Deleted',
          message: 'Job application removed successfully',
        })

        return true
      } catch (error) {
        console.error('[useApplications] Error deleting application:', error)
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete job application',
        })
        return false
      }
    },
    [applications],
  )

  // Initial load of applications
  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    applications,
    loading,
    refreshing,
    stats,
    addApplication,
    updateApplication,
    deleteApplication,
    refreshApplications: fetchApplications,
  }
}
