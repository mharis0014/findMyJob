import React from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {moderateScale, moderateVerticalScale, scale} from 'react-native-size-matters'

import {CustomButton} from '../../components/common'

import ICONS from '../../constants/icons'
import {colors} from '../../constants/colors'
import {STRINGS} from '../../constants/strings'
import {RootStackParamList} from '../../constants/types'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectUserType'>

const SelectUserTypeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  const handleHirePress = () => navigation.navigate('JobPostingNavigator')
  const handleJobSeekerPress = () => navigation.navigate('JobSearchingNavigator')

  return (
    <View style={styles.container}>
      <Image source={ICONS.logo} style={styles.logo} accessibilityLabel="App logo" />

      <Text style={styles.title}>{STRINGS.selectUserType.title}</Text>

      <CustomButton
        title={STRINGS.selectUserType.buttons.hire}
        onPress={handleHirePress}
        type="SOLID"
      />
      <CustomButton
        title={STRINGS.selectUserType.buttons.getJob}
        onPress={handleJobSeekerPress}
        type="OUTLINED"
      />
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
})

export default SelectUserTypeScreen
