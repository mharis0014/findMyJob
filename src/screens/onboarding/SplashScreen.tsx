/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react'
import {View, StyleSheet, Image, Text, ImageSourcePropType} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {moderateScale, moderateVerticalScale, scale, verticalScale} from 'react-native-size-matters'

import {RootStackParamList} from '../../constants/types'

import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('SelectUserType')
    }, 3000)
  }, [])

  return (
    <View style={styles.container}>
      <Image source={ICONS.logo as ImageSourcePropType} resizeMode="contain" style={styles.logo} />
      <Text style={styles.name}>FindMyJob</Text>
      <Text style={styles.slogan}>Post & Find Jobs in One Place</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logo: {
    width: scale(100),
    height: verticalScale(80),
  },
  name: {
    fontSize: moderateScale(30),
    fontWeight: '900',
    marginTop: moderateVerticalScale(18),
    color: colors.textColor,
  },
  slogan: {
    fontSize: moderateScale(16),
    fontStyle: 'italic',
    position: 'absolute',
    bottom: moderateVerticalScale(50),
    fontWeight: '800',
    color: colors.textColor,
  },
})

export default SplashScreen
