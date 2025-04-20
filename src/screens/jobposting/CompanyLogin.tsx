import React from 'react'
import {StyleSheet, Image, Text} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import {SafeAreaView} from 'react-native-safe-area-context'
import {moderateScale, moderateVerticalScale, scale} from 'react-native-size-matters'

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'

import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'
import {JobPostingStackParamList} from '../../constants/types'

type NavigationProp = NativeStackNavigationProp<JobPostingStackParamList, 'CompanyLogin'>

const CompanyLogin = () => {
  const navigation = useNavigation<NavigationProp>()

  const handleLoginPress = () => {}
  const handleSignupPress = () => navigation.navigate('CompanySignup')

  return (
    <SafeAreaView style={styles.container}>
      <Image source={ICONS.logo} style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      <CustomTextInput title={'Email'} placeholder={'xyz@gmail.com'} />
      <CustomTextInput title={'Password'} placeholder={'********'} />

      <Text style={styles.forgotPassword}>Forgot Password?</Text>

      <CustomButton type="SOLID" title={'Login'} onPress={handleLoginPress} />
      <CustomButton type="OUTLINED" title={'Create Account'} onPress={handleSignupPress} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logo: {
    width: scale(80),
    height: scale(70),
    marginTop: moderateVerticalScale(40),
    alignSelf: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    alignSelf: 'center',
    fontWeight: '900',
    marginTop: moderateVerticalScale(50),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: moderateScale(20),
    marginTop: moderateVerticalScale(10),
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
})

export default CompanyLogin
