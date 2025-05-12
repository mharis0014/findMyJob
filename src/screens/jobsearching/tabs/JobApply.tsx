import React from 'react'
import {View, StyleSheet} from 'react-native'

import NoLoginComponent from '../../../components/common/NoLoginComponent'
import {colors} from '../../../constants/colors'

const JobApply = () => {
  return (
    <View style={styles.container}>
      <NoLoginComponent
        heading="One Place to track all your applications"
        description="Track all your jobs that you applied.But For that you need to create an account first"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
})

export default JobApply
