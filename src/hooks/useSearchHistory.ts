import {useState, useCallback} from 'react'
import LocalStorage from '../utils/localStorage'

const SEARCH_NAMESPACE = 'search'
const SEARCH_HISTORY_KEY = 'history'
const MAX_HISTORY_ITEMS = 20

/**
 * Custom hook to manage user search history for
 * tracking and providing job recommendations
 */
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * Load search history from storage
   */
  const loadSearchHistory = useCallback(async () => {
    try {
      setLoading(true)
      const history =
        (await LocalStorage.getNamespacedItem<string[]>(SEARCH_NAMESPACE, SEARCH_HISTORY_KEY)) || []

      setSearchHistory(Array.isArray(history) ? history : [])
    } catch (error) {
      console.error('Error loading search history:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Add a search term to history
   */
  const addSearchTerm = useCallback(
    async (term: string) => {
      if (!term || term.trim() === '') return

      try {
        const cleanTerm = term.trim()

        // Create new history array with the new term at the beginning
        // and remove any duplicates of the same term
        const updatedHistory = [
          cleanTerm,
          ...searchHistory.filter(item => item !== cleanTerm),
        ].slice(0, MAX_HISTORY_ITEMS)

        // Update state
        setSearchHistory(updatedHistory)

        // Save to storage
        await LocalStorage.setNamespacedItem(SEARCH_NAMESPACE, SEARCH_HISTORY_KEY, updatedHistory)
      } catch (error) {
        console.error('Error adding search term:', error)
      }
    },
    [searchHistory],
  )

  /**
   * Clear search history
   */
  const clearSearchHistory = useCallback(async () => {
    try {
      setSearchHistory([])
      await LocalStorage.removeNamespacedItem(SEARCH_NAMESPACE, SEARCH_HISTORY_KEY)
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }, [])

  /**
   * Remove a specific search term
   */
  const removeSearchTerm = useCallback(
    async (term: string) => {
      try {
        const updatedHistory = searchHistory.filter(item => item !== term)
        setSearchHistory(updatedHistory)

        await LocalStorage.setNamespacedItem(SEARCH_NAMESPACE, SEARCH_HISTORY_KEY, updatedHistory)
      } catch (error) {
        console.error('Error removing search term:', error)
      }
    },
    [searchHistory],
  )

  return {
    searchHistory,
    loading,
    loadSearchHistory,
    addSearchTerm,
    removeSearchTerm,
    clearSearchHistory,
  }
}
