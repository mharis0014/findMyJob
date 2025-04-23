import {useState} from 'react'

import {addDoc, collection, serverTimestamp} from '@react-native-firebase/firestore'

import {showToast} from '../utils/toast'
import {firestoreDB} from '../config/firebaseConfig'

export const useCompanySignup = () => {
  const [loading, setLoading] = useState(false)

  const registerCompany = async (data: any, navigation: any) => {
    setLoading(true)
    try {
      await addDoc(collection(firestoreDB, 'job_posting'), {
        ...data,
        createdAt: serverTimestamp(),
      })

      showToast({
        type: 'success',
        title: 'Signup Successful',
        message: 'Company has been registered successfully!',
      })

      navigation.goBack()
    } catch (error) {
      console.error('Signup error:', error)
      showToast({
        type: 'error',
        title: 'Signup Failed',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return {loading, registerCompany}
}
