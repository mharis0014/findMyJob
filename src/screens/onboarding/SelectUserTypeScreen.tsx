import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image, GestureResponderEvent} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {moderateScale, moderateVerticalScale, scale, verticalScale} from 'react-native-size-matters'

import ICONS from '../../constants/icons'
import {colors} from '../../constants/colors'
import {RootStackParamList} from '../../constants/types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectUserType'>

const SelectUserTypeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  const handleHirePress = () => navigation.navigate('JobPostingNavigator')
  const handleJobSeekerPress = () => navigation.navigate('JobSearchingNavigator')

  return (
    <View style={styles.container}>
      <Image source={ICONS.logo} style={styles.logo} accessibilityLabel="App logo" />

      <Text style={styles.title}>What are you looking for?</Text>

      <TouchableOpacity
        style={styles.solidButton}
        activeOpacity={0.7}
        onPress={handleHirePress}
        accessibilityRole="button"
        accessibilityLabel='accessibilityLabel="Want to hire a candidate'>
        <Text style={styles.buttonTextLight}>Want to Hire a Candidate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.outlineButton}
        activeOpacity={0.7}
        onPress={handleJobSeekerPress}
        accessibilityRole="button"
        accessibilityLabel="want to get a job">
        <Text style={styles.buttonTextDark}>Want to Get a Job</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: scale(100),
    height: scale(90),
    marginBottom: moderateVerticalScale(50),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '900',
  },
  outlineButton: {
    width: '90%',
    height: verticalScale(50),
    borderColor: colors.textColor,
    borderWidth: 1,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
  },
  solidButton: {
    width: '90%',
    height: verticalScale(50),
    backgroundColor: colors.textColor,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateVerticalScale(20),
  },
  buttonTextLight: {
    color: colors.background,
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  buttonTextDark: {
    color: colors.textColor,
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
})

export default SelectUserTypeScreen
