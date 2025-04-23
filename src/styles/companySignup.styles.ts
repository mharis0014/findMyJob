import {StyleSheet} from 'react-native'

import {moderateScale, moderateVerticalScale, scale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: moderateVerticalScale(30),
  },
  logo: {
    width: scale(80),
    height: scale(70),
    marginTop: moderateVerticalScale(40),
    alignSelf: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    alignSelf: 'center',
    fontWeight: '900',
    marginTop: moderateVerticalScale(50),
  },
  errorMessage: {
    marginLeft: moderateScale(20),
    color: colors.red,
  },
})

export default styles
