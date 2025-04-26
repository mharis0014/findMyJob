import {StyleSheet} from 'react-native'

import {moderateScale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: moderateScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: '900',
    color: colors.black,
    marginLeft: moderateScale(20),
    marginBottom: moderateScale(10),
  },
  listContainer: {
    paddingBottom: verticalScale(20),
  },
  card: {
    backgroundColor: colors.offWhite,
    marginHorizontal: moderateScale(20),
    marginVertical: moderateScale(10),
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 4,
  },
  jobTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    color: colors.black,
  },
  jobDescription: {
    fontSize: moderateScale(14),
    color: colors.textPrimary,
    marginTop: moderateScale(6),
    marginBottom: moderateScale(12),
  },
  jobInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(8),
  },
  infoLabel: {
    fontSize: moderateScale(14),
    color: colors.textPrimary,
    fontWeight: '600',
    width: moderateScale(90),
  },
  infoValue: {
    fontSize: moderateScale(14),
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(20),
  },
  editButton: {
    flex: 1,
    height: verticalScale(42),
    backgroundColor: colors.primary,
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(8),
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButton: {
    flex: 1,
    height: verticalScale(42),
    backgroundColor: colors.error,
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: moderateScale(8),
    shadowColor: colors.error,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: colors.white,
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  button: {
    flex: 0.48,
    height: verticalScale(40),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: moderateScale(16),
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary, // or any color you set
    marginRight: 6,
  },
  value: {
    fontSize: 14,
    color: colors.textPrimary, // or any color you set
  },
})

export default styles
