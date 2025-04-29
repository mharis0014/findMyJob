import React from 'react'
import {View, Text} from 'react-native'

import JobInfoRow from './JobInfoRow'
import ActionButton from '../common/ActionButton'

import {colors} from '../../constants/colors'
import {JobType} from '../../constants/types'

import styles from '../../styles/myJobs.styles'

interface JobCardProps {
  job: JobType
  onEdit: () => void
  onDelete: () => void
}

const JobCard = ({job, onEdit, onDelete}: JobCardProps) => (
  <View style={styles.card}>
    <Text style={styles.jobTitle}>{job.jobTitle}</Text>
    <Text style={styles.jobDescription}>{job.jobDesc}</Text>

    <JobInfoRow label="Salary" value={`${job.salaryPackage} L/year`} />
    <JobInfoRow label="Category" value={job.category} />
    <JobInfoRow label="Skill" value={job.skill} />

    <View style={styles.buttonContainer}>
      <ActionButton title="Edit" backgroundColor={colors.primary} onPress={onEdit} />
      <ActionButton title="Delete" backgroundColor={colors.error} onPress={onDelete} />
    </View>
  </View>
)

export default JobCard
