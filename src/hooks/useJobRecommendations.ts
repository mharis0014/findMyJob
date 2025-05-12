import {useState, useCallback} from 'react'
import firestore from '@react-native-firebase/firestore'

import {JobType} from '../constants/types'
import {useProfileStore} from '../utils/stateManagement'
import LocalStorage from '../utils/localStorage'
import {showToast} from '../utils/toast'

/**
 * Custom hook for fetching job recommendations based on user profile and preferences
 */
export const useJobRecommendations = () => {
  const [recommendations, setRecommendations] = useState<JobType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const {profile} = useProfileStore()

  /**
   * Fetch job recommendations from Firestore
   */
  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get user ID
      const userId = await LocalStorage.getItem('userId')
      if (!userId) {
        throw new Error('User ID not found')
      }

      // Get user's search history and previously viewed jobs
      const searchHistory = ((await LocalStorage.getItem('searchHistory')) || []) as string[]
      const viewedJobs = ((await LocalStorage.getItem('viewedJobs')) || []) as string[]

      // Fetch jobs from Firestore
      let jobsSnapshot

      // If user has skills in profile, prioritize those
      if (profile?.skills && profile.skills.length > 0) {
        // Limit to first 10 skills to stay within Firestore "in" query limits
        const skillsToQuery = profile.skills.slice(0, 10)
        jobsSnapshot = await firestore()
          .collection('jobs')
          .where('skill', 'in', skillsToQuery)
          .limit(20)
          .get()
      }
      // Otherwise just get recent jobs
      else {
        jobsSnapshot = await firestore()
          .collection('jobs')
          .orderBy('createdAt', 'desc')
          .limit(20)
          .get()
      }

      let recommendedJobs = jobsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<JobType, 'id'>),
      }))

      // If we have search history, filter results to match search terms
      if (searchHistory.length > 0) {
        const searchTerms = searchHistory.slice(0, 3)
        recommendedJobs = recommendedJobs.filter(job => {
          const jobText =
            `${job.jobTitle} ${job.jobDesc} ${job.skill} ${job.category}`.toLowerCase()
          return searchTerms.some((term: string) => jobText.includes(term.toLowerCase()))
        })
      }

      // Remove any jobs user has already viewed (if any)
      if (viewedJobs.length > 0) {
        recommendedJobs = recommendedJobs.filter(job => !viewedJobs.includes(job.id))
      }

      // Sort by relevance (more sophisticated sorting would be used in a real app)
      recommendedJobs.sort((_a, _b) => {
        // Sort logic could factor in job match score, recency, etc.
        return 0 // Simple placeholder
      })

      setRecommendations(recommendedJobs)
    } catch (err) {
      console.error('[useJobRecommendations] Error fetching recommendations:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'))
      showToast({
        type: 'error',
        title: 'Failed to fetch recommendations',
        message: 'Please try again later',
      })
    } finally {
      setLoading(false)
    }
  }, [profile])

  /**
   * Refresh recommendations
   */
  const refreshRecommendations = useCallback(async () => {
    await fetchRecommendations()
  }, [fetchRecommendations])

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations,
    fetchRecommendations,
  }
}
