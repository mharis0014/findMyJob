import {useState} from 'react'
import firestore from '@react-native-firebase/firestore'

import LocalStorage from '../utils/localStorage'
import {showToast} from '../utils/toast'
import {JobForm} from '../constants/types'

export const usePostJob = () => {
  const [loading, setLoading] = useState(false)

  const postJob = async (form: JobForm, onSuccess?: () => void) => {
    try {
      setLoading(true)
      const userId = await LocalStorage.getItem('userId')
      const name = await LocalStorage.getItem('name')

      await firestore().collection('jobs').add({
        postedBy: userId,
        posterName: name,
        jobTitle: form.jobTitle,
        jobDesc: form.jobDesc,
        experience: form.experience,
        salaryPackage: form.salaryPackage,
        company: form.company,
        category: form.selectedCategory,
        skill: form.selectedSkill,
        createdAt: firestore.FieldValue.serverTimestamp(),
      })

      showToast({
        type: 'success',
        title: 'Job Posted',
        message: 'Your job has been successfully posted.',
      })

      onSuccess?.()
    } catch (error) {
      console.error('Post Job Error:', error)
      showToast({
        type: 'error',
        title: 'Error Posting Job',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }
  return {loading, postJob}
}
