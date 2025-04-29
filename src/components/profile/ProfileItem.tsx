import React from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet, ImageSourcePropType} from 'react-native'

import {moderateScale, scale} from 'react-native-size-matters'

import ICONS from '../../constants/icons'
import {colors} from '../../constants/colors'

type Props = {
  title: string
  icon: ImageSourcePropType | undefined
  onPress: () => void
}

const ProfileItem = ({title, icon, onPress}: Props) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.row}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Image source={ICONS.chevron_right} style={styles.chevron} resizeMode="contain" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: moderateScale(14),
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: scale(24),
    height: scale(24),
    tintColor: colors.textPrimary,
  },
  title: {
    marginLeft: moderateScale(16),
    fontSize: moderateScale(16),
    color: colors.textPrimary,
    fontWeight: '600',
  },
  chevron: {
    width: scale(12),
    height: scale(12),
    tintColor: colors.textSecondary,
  },
})

export default ProfileItem
