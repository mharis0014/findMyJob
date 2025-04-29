import React from 'react'
import {FlatList} from 'react-native'

import JobCardShimmer from './JobCardShimmer'

import styles from '../../styles/myJobs.styles'

const JobCardShimmerList = () => {
  return (
    <FlatList
      data={[1, 2, 3]}
      keyExtractor={(item, index) => `shimmer-${index}`}
      renderItem={() => <JobCardShimmer />}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  )
}

export default JobCardShimmerList
