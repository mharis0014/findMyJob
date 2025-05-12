import React from 'react'
import {View, StyleSheet} from 'react-native'

import NoLoginComponent from '../../../components/common/NoLoginComponent'

import {colors} from '../../../constants/colors'

const Profile = () => {
  return (
    <View style={styles.container}>
      <NoLoginComponent
        heading="Manage your Profile Easily"
        description="Build your profile like professionals to attract jobs you want"
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

export default Profile
