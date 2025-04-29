import React, {useCallback, useMemo} from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native'

import {SafeAreaView} from 'react-native-safe-area-context'
import {moderateScale, moderateVerticalScale, scale, verticalScale} from 'react-native-size-matters'

import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
  },
  image: {
    width: scale(54),
    height: scale(54),
    marginRight: moderateScale(12),
  },
  heading: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.black,
  },
  subHeading: {
    fontSize: moderateScale(10),
    color: colors.gray,
    marginTop: moderateScale(4),
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: moderateVerticalScale(20),
    paddingHorizontal: moderateScale(16),
  },
  button: {
    width: '40%',
    height: verticalScale(35),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.black,
  },
  buttonSecondary: {
    borderColor: colors.black,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  buttonTextPrimary: {
    color: colors.white,
  },
  buttonTextSecondary: {
    color: colors.black,
  },
  separator: {
    height: verticalScale(1),
    backgroundColor: colors.darkGray,
    opacity: 0.3,
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(24),
  },
  menuItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    height: verticalScale(50),
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: scale(24),
    height: scale(24),
    marginRight: moderateScale(10),
  },
  menuItemText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: colors.black,
  },
  rightIcon: {
    width: scale(18),
    height: scale(18),
    tintColor: colors.gray,
  },
})

export default CustomDrawer
