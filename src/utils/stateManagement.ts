/**
 * Global state management using Zustand
 *
 * This provides a lightweight, easy-to-use state management solution
 * that works well with React hooks and TypeScript.
 */

import {create} from 'zustand'
import {persist, createJSONStorage} from 'zustand/middleware'
import {MMKV} from 'react-native-mmkv'

import {JobType, UserProfile} from '../constants/types'

// Storage instance for persisting state
const storage = new MMKV({
  id: 'findMyJob-store',
  encryptionKey: 'findMyJob-secure-key',
})

// Storage adapter for Zustand persist middleware with MMKV
const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name)
    return value ? Promise.resolve(value) : Promise.resolve(null)
  },
  setItem: (name: string, value: string) => {
    storage.set(name, value)
    return Promise.resolve(true)
  },
  removeItem: (name: string) => {
    storage.delete(name)
    return Promise.resolve()
  },
}

// Types for auth state
interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  userType: 'company' | 'jobseeker' | null
  setAuth: (userId: string, userType: 'company' | 'jobseeker') => void
  clearAuth: () => void
}

// Auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      userId: null,
      userType: null,
      setAuth: (userId, userType) => set({isAuthenticated: true, userId, userType}),
      clearAuth: () => set({isAuthenticated: false, userId: null, userType: null}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
)

// Types for job state
interface JobsState {
  jobs: JobType[]
  lastUpdated: Date | null
  setJobs: (jobs: JobType[]) => void
  addJob: (job: JobType) => void
  updateJob: (updatedJob: JobType) => void
  removeJob: (jobId: string) => void
  clearJobs: () => void
}

// Jobs store
export const useJobsStore = create<JobsState>()(set => ({
  jobs: [],
  lastUpdated: null,
  setJobs: jobs => set({jobs, lastUpdated: new Date()}),
  addJob: job =>
    set(state => ({
      jobs: [job, ...state.jobs],
      lastUpdated: new Date(),
    })),
  updateJob: updatedJob =>
    set(state => ({
      jobs: state.jobs.map(job => (job.id === updatedJob.id ? updatedJob : job)),
      lastUpdated: new Date(),
    })),
  removeJob: jobId =>
    set(state => ({
      jobs: state.jobs.filter(job => job.id !== jobId),
      lastUpdated: new Date(),
    })),
  clearJobs: () => set({jobs: [], lastUpdated: null}),
}))

// Types for user profile state
interface UserProfileState {
  profile: UserProfile | null
  isLoading: boolean
  setProfile: (profile: UserProfile) => void
  clearProfile: () => void
  setLoading: (isLoading: boolean) => void
}

// User profile store
export const useProfileStore = create<UserProfileState>()(set => ({
  profile: null,
  isLoading: false,
  setProfile: profile => set({profile}),
  clearProfile: () => set({profile: null}),
  setLoading: isLoading => set({isLoading}),
}))

// Types for app settings
interface AppSettingsState {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setNotifications: (enabled: boolean) => void
  setLanguage: (language: string) => void
}

// App settings store with persistence
export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    set => ({
      theme: 'system',
      notifications: true,
      language: 'en',
      setTheme: theme => set({theme}),
      setNotifications: notifications => set({notifications}),
      setLanguage: language => set({language}),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
)
