import React from 'react'
import {View, StyleSheet} from 'react-native'

import NoLoginComponent from '../../../components/common/NoLoginComponent'

import {colors} from '../../../constants/colors'

const Inbox = () => {
  return (
    <View style={styles.container}>
      <NoLoginComponent
        heading="You can chat with recruiters of MNCs"
        description="Talk to any recruiter for getting a job recommendation from MNCs"
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

export default Inbox
