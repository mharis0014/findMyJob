import React from 'react'
import {View, Text, StyleSheet} from 'react-native'

import {colors} from '../../constants/colors'
import {moderateScale} from 'react-native-size-matters'
import CustomButton from './CustomButton'

type Props = {
  heading: string
  description: string
}

const NoLoginComponent = ({heading = '', description = ''}: Props) => {
  const handleLoginPress = () => {}
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.description}>{description}</Text>

      <CustomButton type="SOLID" title="Login" onPress={handleLoginPress} />

      <View style={styles.signupText}>
        <Text style={styles.text1}>Dont have an Account?</Text>
        <Text style={styles.text2}>Create an Account</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: moderateScale(24),
    alignSelf: 'center',
    width: '90%',
    marginTop: moderateScale(100),
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    width: '80%',
    alignSelf: 'center',
    fontSize: moderateScale(12),
    textAlign: 'center',
    marginTop: moderateScale(10),
  },
  signupText: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
    marginTop: moderateScale(50),
    justifyContent: 'center',
  },
  text1: {
    fontWeight: '700',
    fontSize: moderateScale(16),
  },
  text2: {
    fontWeight: '900',
    fontSize: moderateScale(16),
    marginLeft: moderateScale(8),
  },
})

export default NoLoginComponent
