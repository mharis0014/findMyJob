import {useState} from 'react'

import firestore from '@react-native-firebase/firestore'

import {showToast} from '../utils/toast'
import LocalStorage from '../utils/localStorage'
import {CompanyProfileUpdateType} from '../constants/types'

export const useEditCompanyProfile = () => {
  const [loading, setLoading] = useState(false)

  const editCompanyProfile = async (data: CompanyProfileUpdateType, onSuccess?: () => void) => {
    try {
      setLoading(true)
      const userId = await LocalStorage.getItem('userId')

      if (!userId) throw new Error('User ID not found')

      console.log(data)

      await firestore()
        .collection('job_posting')
        .doc(userId)
        .update({
          ...data,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })

      showToast({
        type: 'success',
        title: 'Edit Profile Successful',
        message: 'Profile has been updated successfully!',
      })

      onSuccess?.()
    } catch (error) {
      console.error('Edit Profile Error:', error)
      showToast({
        type: 'error',
        title: 'Edit Profile Failed',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return {loading, editCompanyProfile}
}
