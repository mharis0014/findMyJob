import {StyleSheet} from 'react-native'

import {moderateVerticalScale, scale, verticalScale, moderateScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

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

export default styles
