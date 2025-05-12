import {useCallback, useEffect, useState} from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import {create} from 'zustand'

/**
 * Authentication store using Zustand
 */
interface AuthState {
  isLoggedIn: boolean
  isLoading: boolean
  user: any | null
  userType: 'company' | 'jobseeker' | null
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, userType: 'company' | 'jobseeker') => Promise<boolean>
  logout: () => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  isLoading: true,
  user: null,
  userType: null,
  error: null,

  login: async (email, password) => {
    set({isLoading: true, error: null})
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password)

      // Fetch user profile
      const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get()
      const userData = userDoc.data()

      // Update auth state
      set({
        isLoggedIn: true,
        isLoading: false,
        user: userCredential.user,
        userType: userData?.userType || 'jobseeker',
      })

      return true
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to login',
      })
      return false
    }
  },

  register: async (email, password, userType) => {
    set({isLoading: true, error: null})
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password)

      // Create user profile
      await firestore().collection('users').doc(userCredential.user.uid).set({
        email,
        userType,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })

      // Update auth state
      set({
        isLoggedIn: true,
        isLoading: false,
        user: userCredential.user,
        userType,
      })

      return true
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to register',
      })
      return false
    }
  },

  logout: async () => {
    set({isLoading: true, error: null})
    try {
      await auth().signOut()
      set({
        isLoggedIn: false,
        isLoading: false,
        user: null,
        userType: null,
      })
      return true
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to logout',
      })
      return false
    }
  },

  resetPassword: async email => {
    set({isLoading: true, error: null})
    try {
      await auth().sendPasswordResetEmail(email)
      set({isLoading: false})
      return true
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to reset password',
      })
      return false
    }
  },

  clearError: () => set({error: null}),
}))

/**
 * Custom hook for using auth functionality
 */
export const useAuth = () => {
  const authState = useAuthStore()

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        // User is signed in
        try {
          const userDoc = await firestore().collection('users').doc(user.uid).get()
          const userData = userDoc.data()

          useAuthStore.setState({
            isLoggedIn: true,
            isLoading: false,
            user,
            userType: userData?.userType || 'jobseeker',
          })
        } catch (error) {
          console.error('Error fetching user data:', error)
          useAuthStore.setState({
            isLoggedIn: true,
            isLoading: false,
            user,
            userType: 'jobseeker', // Default fallback
          })
        }
      } else {
        // User is signed out
        useAuthStore.setState({
          isLoggedIn: false,
          isLoading: false,
          user: null,
          userType: null,
        })
      }
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  return authState
}
