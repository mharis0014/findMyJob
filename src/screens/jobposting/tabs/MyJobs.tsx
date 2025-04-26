import React, {useCallback, useEffect, useState} from 'react'
import {View, Text, FlatList} from 'react-native'

import {useIsFocused, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import firestore from '@react-native-firebase/firestore'

import JobInfoRow from '../../../components/JobInfoRow'
import ActionButton from '../../../components/ActionButton'
import CustomAlert from '../../../components/CustomAlert'
import CustomLoader from '../../../components/CustomLoader'

import LocalStorage from '../../../utils/localStorage'
import {CompanyAppStackParamList, JobType} from '../../../constants/types'
import {colors} from '../../../constants/colors'
import styles from '../../../styles/myJobs.styles'

type NavigationProp = NativeStackNavigationProp<CompanyAppStackParamList>

const MyJobs = () => {
  const navigation = useNavigation<NavigationProp>()
  const isFocused = useIsFocused()

  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [alertVisible, setAlertVisible] = useState<boolean>(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)
      const userId = await LocalStorage.getItem('userId')
      const snapshot = await firestore().collection('jobs').where('postedBy', '==', userId).get()

      const jobsList: JobType[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<JobType, 'id'>),
      }))

      setJobs(jobsList)
    } catch (error) {
      console.error('[MyJobs]', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isFocused) {
      fetchJobs()
    }
  }, [isFocused, fetchJobs])

  const handleDeleteJob = (jobId: string) => {
    setJobToDelete(jobId)
    setAlertVisible(true)
  }

  const handleEditJob = (job: JobType) => {
    navigation.getParent()?.navigate('EditJob', {data: job})
  }

  const handleConfirmDelete = async () => {
    if (jobToDelete) {
      try {
        await firestore().collection('jobs').doc(jobToDelete).delete()
        fetchJobs() // Re-fetch jobs after deletion
      } catch (error) {
        console.error('[MyJobs] Error deleting job:', error)
      } finally {
        setAlertVisible(false)
        setJobToDelete(null)
      }
    }
  }

  const handleCancelDelete = () => {
    setAlertVisible(false)
    setJobToDelete(null)
  }

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No Jobs Found</Text>
    </View>
  )

  const renderJobItem = ({item}: {item: JobType}) => (
    <View style={styles.card}>
      <Text style={styles.jobTitle}>{item.jobTitle}</Text>
      <Text style={styles.jobDescription}>{item.jobDesc}</Text>

      <JobInfoRow label="Salary" value={`${item.salaryPackage} L/year`} />
      <JobInfoRow label="Category" value={item.category} />
      <JobInfoRow label="Skill" value={item.skill} />

      <View style={styles.buttonContainer}>
        <ActionButton
          title="Edit"
          backgroundColor={colors.primary}
          onPress={() => handleEditJob(item)}
        />
        <ActionButton
          title="Delete"
          backgroundColor={colors.error}
          onPress={() => handleDeleteJob(item.id)}
        />
      </View>
    </View>
  )

  return (
    <View style={styles.screen}>
      <Text style={styles.headerTitle}>FindMyJob</Text>

      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={renderJobItem}
        contentContainerStyle={[styles.listContainer, jobs.length === 0 && styles.screenCenter]}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />

      {/* Alert for Delete Confirmation */}
      <CustomAlert
        visible={alertVisible}
        title="Delete Job"
        description="Are you sure you want to delete this job?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <CustomLoader visible={loading} />
    </View>
  )
}

export default MyJobs
