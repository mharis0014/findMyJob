import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'

import {moderateScale, scale, verticalScale} from 'react-native-size-matters'

import ICONS from '../../constants/icons'

type Props = {
  title: string
  handleBackPress: () => void
}

const CustomHeader = ({title, handleBackPress}: Props) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={handleBackPress}>
        <Image source={ICONS.left_arrow} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: verticalScale(45),

    paddingLeft: moderateScale(15),
    marginTop: verticalScale(20),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: scale(20),
    height: scale(20),
  },
  title: {
    fontSize: moderateScale(18),
    marginLeft: moderateScale(10),
    fontWeight: '900',
  },
})

export default CustomHeader
