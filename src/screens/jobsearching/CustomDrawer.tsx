import React, {useCallback, useMemo} from 'react'
import {View, Text, Image, TouchableOpacity, FlatList, ListRenderItemInfo} from 'react-native'

import {SafeAreaView} from 'react-native-safe-area-context'
import {moderateVerticalScale} from 'react-native-size-matters'

import ICONS from '../../constants/icons'
import styles from '../../styles/customDrawer.styles'

interface MenuItem {
  title: string
  icon: any
  onPress?: () => void
}

const menuItems: MenuItem[] = [
  {title: 'Rate Us', icon: ICONS.review},
  {title: 'Theme', icon: ICONS.theme},
  {title: 'Logout', icon: ICONS.logout},
]

const CustomDrawer: React.FC = () => {
  const handleLoginPress = useCallback(() => {
    // Navigate to login
  }, [])

  const handleRegisterPress = useCallback(() => {
    // Navigate to register
  }, [])

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<MenuItem>) => (
      <TouchableOpacity onPress={item.onPress} activeOpacity={0.7} style={styles.menuItemContainer}>
        <View style={styles.menuItemLeft}>
          <Image source={item.icon} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>{item.title}</Text>
        </View>
        <Image source={ICONS.chevron_right} style={styles.rightIcon} />
      </TouchableOpacity>
    ),
    [],
  )

  const listContentStyle = useMemo(() => ({marginTop: moderateVerticalScale(40)}), [])

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={ICONS.user} style={styles.image} />
        <View>
          <Text style={styles.heading}>Build Your Profile</Text>
          <Text style={styles.subHeading}>Job Opportunities waiting for you at FindMyJob</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleLoginPress}
          activeOpacity={0.7}>
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleRegisterPress}
          activeOpacity={0.7}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.separator} />

      {/* Menu List */}
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        contentContainerStyle={listContentStyle}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  )
}

export default CustomDrawer
