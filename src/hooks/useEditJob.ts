import {useState} from 'react'
import firestore from '@react-native-firebase/firestore'

import LocalStorage from '../utils/localStorage'
import {showToast} from '../utils/toast'
import {JobForm} from '../constants/types'

export const useEditJob = () => {
  const [loading, setLoading] = useState(false)

  const editJob = async (form: JobForm, id: string, onSuccess?: () => void) => {
    try {
      setLoading(true)
      const userId = await LocalStorage.getItem('userId')
      const name = await LocalStorage.getItem('name')

      await firestore().collection('jobs').doc(id).update({
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
        title: 'Job Edited',
        message: 'Your job has been successfully updated.',
      })

      onSuccess?.()
    } catch (error) {
      console.error('Edit Job Error:', error)
      showToast({
        type: 'error',
        title: 'Error Editing Job',
        message: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }
  return {loading, editJob}
}
