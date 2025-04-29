import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

type Props = {
  message: string
}

const CustomErrorMessage: React.FC<Props> = ({message}) => {
  if (!message) return null

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
})

export default CustomErrorMessage
