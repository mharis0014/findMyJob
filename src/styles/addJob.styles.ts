import {StyleSheet} from 'react-native'

import {moderateScale, scale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    width: '100%',
    height: verticalScale(45),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: moderateScale(20),
    marginTop: verticalScale(10),
  },
  icon: {
    width: scale(16),
    height: scale(16),
  },
  title: {
    fontSize: moderateScale(18),
    marginLeft: moderateScale(20),
    fontWeight: '900',
  },
  modalMainView: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingView: {
    width: '90%',
    height: '80%',
    borderRadius: moderateScale(10),
    backgroundColor: colors.background,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '900',
    alignSelf: 'center',
    marginVertical: moderateScale(15),
  },
  profileItem: {
    width: '90%',
    height: verticalScale(40),
    justifyContent: 'center',
    paddingLeft: moderateScale(20),
    alignSelf: 'center',
    borderBottomWidth: 0.4,
  },
})

export default styles
