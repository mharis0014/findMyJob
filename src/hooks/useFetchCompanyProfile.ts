import {useEffect} from 'react'

import firestore from '@react-native-firebase/firestore'

import LocalStorage from '../utils/localStorage'
import {showToast} from '../utils/toast'

export const useFetchCompanyProfile = (reset: (values: any) => void) => {
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userEmail = await LocalStorage.getItem('email')
        if (!userEmail) console.error('No user email found in local storage')

        const snapshot = await firestore()
          .collection('job_posting')
          .where('email', '==', userEmail)
          .get()

        if (snapshot.empty) {
          console.warn('No user profile found for this email')

          showToast({
            type: 'info',
            title: 'No Profile',
            message: 'No Profile found. Please try again',
          })

          return
        }

        const userDoc = snapshot.docs[0]?.data()

        if (userDoc) {
          const defaultValues = {
            name: userDoc.name ?? '',
            email: userDoc.email ?? '',
            contact: userDoc.contact ?? '',
            companyName: userDoc.companyName ?? '',
            address: userDoc.address ?? '',
          }
          reset(defaultValues)
        }
      } catch (error) {
        console.error('Failed to fetch user profile: ', error)

        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to load profile. Please try again',
        })
      }
    }

    fetchProfile()
  }, [reset])
}
