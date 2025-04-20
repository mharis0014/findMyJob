import React from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'

import {moderateScale, moderateVerticalScale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const CustomTextInput = ({title, placeholder}: {title: string; placeholder: string}) => {
  return (
    <View style={styles.input}>
      <Text style={styles.title}>{title}</Text>
      <TextInput placeholderTextColor={colors.gray} placeholder={placeholder} />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    width: '90%',
    height: verticalScale(45),
    borderWidth: 0.4,
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: moderateVerticalScale(20),
    paddingHorizontal: moderateScale(15),
    borderRadius: moderateScale(10),
  },
  title: {
    position: 'absolute',
    alignSelf: 'flex-start',
    marginLeft: moderateScale(20),
    top: -moderateVerticalScale(10),
    backgroundColor: colors.background,
    paddingHorizontal: moderateScale(10),
    color: colors.textColor,
    fontSize: moderateScale(13),
    fontWeight: '900',
  },
})

export default CustomTextInput
