import React from 'react'
import {Text, StyleSheet, TouchableOpacity} from 'react-native'

import {moderateScale, moderateVerticalScale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

type ButtonProps = {
  type: 'SOLID' | 'OUTLINED'
  title: string
  onPress: () => void
}

const CustomButton: React.FC<ButtonProps> = ({type, title, onPress}) => {
  const isSolid = type === 'SOLID'

  const containerStyle = [styles.button, isSolid ? styles.solidButton : styles.outlinedButton]

  const textStyle = isSolid ? styles.solidText : styles.outlinedText

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={containerStyle}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    height: verticalScale(45),
    alignSelf: 'center',
    marginTop: moderateVerticalScale(20),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colors.background,
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  solidButton: {
    backgroundColor: colors.textColor,
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: colors.textColor,
  },
  solidText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
  outlinedText: {
    color: colors.textColor,
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
})

export default CustomButton
