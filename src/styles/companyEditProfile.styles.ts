import {StyleSheet} from 'react-native'

import {moderateScale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: moderateScale(24),
    alignSelf: 'center',
    fontWeight: '900',
    marginVertical: verticalScale(10),
  },
})

export default styles
