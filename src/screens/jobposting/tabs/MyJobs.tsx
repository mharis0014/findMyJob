import React, {useCallback, useEffect, useState} from 'react'
import {View, Text, FlatList} from 'react-native'

import {useIsFocused, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import firestore from '@react-native-firebase/firestore'

import {
  DeleteJobAlert,
  EmptyJobList,
  JobCard,
  JobCardShimmerList,
} from '../../../components/my_jobs'

import {CompanyAppStackParamList, JobType} from '../../../constants/types'
import LocalStorage from '../../../utils/localStorage'
import {getTimeAgo} from '../../../utils/dateTimeHelper'
import styles from '../../../styles/myJobs.styles'

type NavigationProp = NativeStackNavigationProp<CompanyAppStackParamList>

const MyJobs = () => {
  const navigation = useNavigation<NavigationProp>()
  const isFocused = useIsFocused()

  const [jobs, setJobs] = useState<JobType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [alertVisible, setAlertVisible] = useState<boolean>(false)
  const [jobToDelete, setJobToDelete] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true)

      const storedJobs = await LocalStorage.getItem('jobs')
      if (storedJobs) {
        setJobs(JSON.parse(storedJobs))
      } else {
        const userId = await LocalStorage.getItem('userId')
        const snapshot = await firestore().collection('jobs').where('postedBy', '==', userId).get()

        const jobsList: JobType[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<JobType, 'id'>),
        }))

        setJobs(jobsList)
        LocalStorage.setItem('jobs', JSON.stringify(jobsList))
      }
    } catch (error) {
      console.error('[MyJobs]', error)
    } finally {
      setLoading(false)
      setLastUpdated(new Date())
    }
  }, [])

  useEffect(() => {
    if (isFocused) {
      fetchJobs()
    }
  }, [isFocused, fetchJobs])

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchJobs()
    setRefreshing(false)
  }

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
        fetchJobs()
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

  const renderJobItem = ({item}) => (
    <JobCard
      job={item}
      onEdit={() => handleEditJob(item)}
      onDelete={() => handleDeleteJob(item.id)}
    />
  )

  return (
    <View style={styles.screen}>
      <Text style={styles.headerTitle}>FindMyJob</Text>

      {loading ? (
        <JobCardShimmerList />
      ) : (
        <View>
          <FlatList
            data={jobs}
            keyExtractor={item => item.id}
            renderItem={renderJobItem}
            contentContainerStyle={[styles.listContainer, jobs.length === 0 && styles.screenCenter]}
            ListEmptyComponent={<EmptyJobList />}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          {lastUpdated && <Text style={styles.lastUpdatedText}>{getTimeAgo(lastUpdated)}</Text>}
        </View>
      )}

      <DeleteJobAlert
        visible={alertVisible}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </View>
  )
}

export default MyJobs
