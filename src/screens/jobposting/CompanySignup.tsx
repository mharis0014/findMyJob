import React from 'react'
import {StyleSheet, Image, Text, ScrollView} from 'react-native'

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

const CompanySignup = () => {
  const navigation = useNavigation<NavigationProp>()

  const handleSignupPress = () => {}
  const handleLoginPress = () => navigation.goBack()

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={ICONS.logo} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>

        <CustomTextInput title={'Name'} placeholder={'xyz'} />
        <CustomTextInput title={'Email'} placeholder={'xyz@gmail.com'} />
        <CustomTextInput title={'Contact'} placeholder={'92332*******'} />
        <CustomTextInput title={'Company Name'} placeholder={'ex. google'} />
        <CustomTextInput title={'Address'} placeholder={'ex. Karachi'} />
        <CustomTextInput title={'Password'} placeholder={'********'} />

        <CustomButton type="SOLID" title={'Sign Up'} onPress={handleSignupPress} />
        <CustomButton type="OUTLINED" title={'Login'} onPress={handleLoginPress} />
      </ScrollView>
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
})

export default CompanySignup
