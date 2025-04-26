import React from 'react'
import {Text, TouchableOpacity} from 'react-native'

import styles from '../styles/myJobs.styles'

type Props = {
  title: string
  backgroundColor: string
  onPress: () => void
}

const ActionButton = ({title, backgroundColor, onPress}: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor}]}
      onPress={onPress}
      activeOpacity={0.6}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ActionButton
