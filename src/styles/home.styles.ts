import {StyleSheet} from 'react-native'

import {moderateScale, moderateVerticalScale, scale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    width: '90%',
    height: verticalScale(40),
    borderWidth: 0.5,
    alignSelf: 'center',
    marginTop: moderateScale(20),
    borderRadius: moderateScale(30),
    borderColor: colors.darkGray,
    flexDirection: 'row',
    paddingLeft: moderateScale(15),
    alignItems: 'center',
  },
  icon: {
    width: scale(16),
    height: scale(16),
    tintColor: colors.gray,
  },
  placeholder: {
    marginLeft: moderateScale(10),
    color: colors.gray,
  },
  heading: {
    color: colors.textPrimary,
    fontWeight: '900',
    fontSize: moderateScale(22),
    alignSelf: 'center',
    width: '90%',
    marginTop: moderateScale(20),
  },
  notes: {
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: moderateScale(10),
  },
  note: {
    marginLeft: moderateScale(10),
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
  jobSearchCard: {
    width: '90%',
    height: verticalScale(200),
    alignSelf: 'center',
    marginTop: moderateScale(50),
    backgroundColor: colors.offWhite,
    borderRadius: moderateScale(10),
    paddingBottom: moderateScale(20),
  },
  gif: {
    alignSelf: 'center',
    width: scale(150),
    height: scale(100),
  },
  input: {
    width: '90%',
    height: verticalScale(35),
    borderWidth: 1,
    alignSelf: 'center',
    borderRadius: moderateScale(15),
    paddingLeft: moderateScale(12),
  },
})

export default styles
