import {useState} from 'react'

import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import firestore from '@react-native-firebase/firestore'

import {showToast} from '../utils/toast'
import LocalStorage from '../utils/localStorage'
import {JobPostingStackParamList} from '../constants/types'

export const useCompanyLogin = () => {
  const [loading, setLoading] = useState(false)

  const loginUser = async (
    formData: {email: string; password: string},
    navigation: NativeStackNavigationProp<JobPostingStackParamList, 'CompanyLogin'>,
  ) => {
    setLoading(true)
    try {
      const snapshot = await firestore()
        .collection('job_posting')
        .where('email', '==', formData.email)
        .get()

      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data()

        if (userData.password === formData.password) {
          showToast({
            type: 'success',
            title: 'Login Successful',
            message: 'Welcome back!',
          })

          // Store user data in local storage
          LocalStorage.setItem('userId', snapshot.docs[0].id)
          LocalStorage.setItem('name', userData.name)
          LocalStorage.setItem('email', userData.email)
          LocalStorage.setItem('userType', 'company')

          navigation.navigate('CompanyAppNavigator')
        } else {
          showToast({
            type: 'error',
            title: 'Incorrect Password',
            message: 'Please try again.',
          })
        }
      } else {
        showToast({
          type: 'error',
          title: 'User Not Found',
          message: 'No company registered with this email.',
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return {loading, loginUser}
}
