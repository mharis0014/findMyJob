import {useState, useCallback} from 'react'
import {JobType} from '../constants/types'

export type JobFilters = {
  category?: string
  skill?: string
  minSalary?: number
  maxSalary?: number
  location?: string
  experience?: string
  remote?: boolean
  fullTime?: boolean
  partTime?: boolean
  contract?: boolean
  keywords?: string
}

/**
 * Custom hook for managing job filters and filtering job listings
 */
export const useJobFilters = (jobs: JobType[]) => {
  const [filters, setFilters] = useState<JobFilters>({})
  const [filteredJobs, setFilteredJobs] = useState<JobType[]>(jobs)

  /**
   * Apply filters to the jobs list
   */
  const applyFilters = useCallback(
    (newFilters?: JobFilters) => {
      const activeFilters = newFilters || filters

      // Update filters state if new filters provided
      if (newFilters) {
        setFilters(newFilters)
      }

      // Apply filters to jobs
      const filtered = jobs.filter(job => {
        // Filter by category
        if (activeFilters.category && job.category !== activeFilters.category) {
          return false
        }

        // Filter by skill
        if (activeFilters.skill && job.skill !== activeFilters.skill) {
          return false
        }

        // Filter by salary range
        if (activeFilters.minSalary || activeFilters.maxSalary) {
          const salary = extractSalaryValue(job.salaryPackage)

          if (activeFilters.minSalary && salary < activeFilters.minSalary) {
            return false
          }

          if (activeFilters.maxSalary && salary > activeFilters.maxSalary) {
            return false
          }
        }

        // Filter by keyword search
        if (activeFilters.keywords) {
          const keywords = activeFilters.keywords.toLowerCase().split(' ')
          const jobText =
            `${job.jobTitle} ${job.jobDesc} ${job.skill} ${job.category}`.toLowerCase()

          // Check if any of the keywords match
          const hasKeyword = keywords.some(keyword => jobText.includes(keyword))
          if (!hasKeyword) {
            return false
          }
        }

        // Job passed all filters
        return true
      })

      setFilteredJobs(filtered)
      return filtered
    },
    [jobs, filters],
  )

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    setFilters({})
    setFilteredJobs(jobs)
    return jobs
  }, [jobs])

  /**
   * Update a single filter value
   */
  const updateFilter = useCallback(
    <T extends JobFilters[keyof JobFilters]>(key: keyof JobFilters, value: T) => {
      const newFilters = {
        ...filters,
        [key]: value,
      }

      setFilters(newFilters)
      return applyFilters(newFilters)
    },
    [filters, applyFilters],
  )

  return {
    filters,
    filteredJobs,
    applyFilters,
    resetFilters,
    updateFilter,
  }
}

/**
 * Helper function to extract salary value from string like "$50k-$70k"
 */
const extractSalaryValue = (salaryString: string): number => {
  // Remove currency symbols and other non-numeric characters except digits, dots, and commas
  const cleanString = salaryString.replace(/[^0-9.,]/g, '')

  // Split by dash if there's a range
  const parts = cleanString.split('-')

  // If it's a range, take the average
  if (parts.length > 1) {
    const min = parseFloat(parts[0].replace(/,/g, ''))
    const max = parseFloat(parts[1].replace(/,/g, ''))
    return (min + max) / 2
  }

  // Otherwise parse the single value
  return parseFloat(parts[0].replace(/,/g, ''))
}
