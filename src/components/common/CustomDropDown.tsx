import React from 'react'
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'

import {moderateScale, moderateVerticalScale, scale, verticalScale} from 'react-native-size-matters'

import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'

type Props = {
  title: string
  placeholder: string
  onPress: () => void
  error?: string
}

const CustomDropDown: React.FC<Props> = ({title, placeholder, onPress, error}) => {
  const isUnselected = placeholder.includes('Select')

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Text style={[styles.title, error && styles.errorTextColor]}>{title}</Text>
        <Text style={[styles.placeholder, !isUnselected && styles.placeholderSelected]}>
          {placeholder}
        </Text>
        <Image source={ICONS.arrow_down} style={styles.icon} />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    alignSelf: 'center',
    marginTop: moderateVerticalScale(20),
  },
  inputContainer: {
    flexDirection: 'row',
    height: verticalScale(45),
    borderWidth: 0.4,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputError: {
    borderColor: colors.red,
  },
  title: {
    position: 'absolute',
    alignSelf: 'flex-start',
    marginLeft: moderateScale(20),
    top: -moderateVerticalScale(10),
    backgroundColor: colors.background,
    paddingHorizontal: moderateScale(10),
    fontSize: moderateScale(13),
    fontWeight: '900',
  },
  placeholder: {
    color: colors.darkGray,
  },
  placeholderSelected: {
    color: colors.black,
  },
  icon: {
    width: scale(10),
    height: scale(10),
  },
  errorText: {
    color: colors.red,
    marginTop: moderateVerticalScale(4),
    fontSize: moderateScale(12),
    marginLeft: moderateScale(10),
  },
  errorTextColor: {
    color: colors.red,
  },
})

export default CustomDropDown
