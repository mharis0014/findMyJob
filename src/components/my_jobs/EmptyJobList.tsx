import React from 'react'
import {View, Text} from 'react-native'

import styles from '../../styles/myJobs.styles'

const EmptyJobList = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No Jobs Found</Text>
  </View>
)

export default EmptyJobList
