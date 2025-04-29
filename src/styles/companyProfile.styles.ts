import {StyleSheet} from 'react-native'

import {moderateScale, scale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: moderateScale(30),
    paddingHorizontal: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(28),
    fontWeight: '900',
    color: colors.primary,
    marginTop: moderateScale(16),
  },
  profilePicContainer: {
    alignSelf: 'center',
    marginTop: moderateScale(24),
  },
  profilePic: {
    width: scale(110),
    height: scale(110),
    borderRadius: scale(55),
    backgroundColor: colors.borderColor,
  },
  name: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: colors.textPrimary,
    alignSelf: 'center',
    marginTop: moderateScale(14),
  },
  actionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: moderateScale(20),
  },
  profileOptions: {
    marginTop: moderateScale(40),
  },
})

export default styles
