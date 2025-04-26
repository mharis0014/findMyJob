import React from 'react'
import {View, Text} from 'react-native'

import styles from '../styles/myJobs.styles'

type Props = {label: string; value: string}

const JobInfoRow = ({label, value}: Props) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
)

export default JobInfoRow
