import React from 'react'
import {View, Text, StyleSheet, TextInput, KeyboardTypeOptions} from 'react-native'

import {moderateScale, moderateVerticalScale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

type CustomTextInputProps = {
  title: string
  placeholder: string
  keyboardType?: KeyboardTypeOptions
  secureTextEntry?: boolean
  value: string
  onChangeText: (text: string) => void
  error?: string
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  title,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  value,
  onChangeText,
  error,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <Text style={styles.title}>{title}</Text>
        <TextInput
          placeholderTextColor={colors.gray}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          style={styles.textInput}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    alignSelf: 'center',
    marginTop: moderateVerticalScale(20),
  },
  inputContainer: {
    height: verticalScale(45),
    borderWidth: 0.4,
    borderRadius: moderateScale(10),
    paddingHorizontal: moderateScale(15),
    justifyContent: 'center',
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
    color: colors.textColor,
    fontSize: moderateScale(13),
    fontWeight: '900',
  },
  textInput: {
    fontSize: moderateScale(14),
    color: colors.textColor,
  },
  errorText: {
    color: colors.red,
    marginTop: moderateVerticalScale(4),
    fontSize: moderateScale(12),
    marginLeft: moderateScale(10),
  },
})

export default CustomTextInput
