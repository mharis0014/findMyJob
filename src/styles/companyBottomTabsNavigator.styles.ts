import {StyleSheet} from 'react-native'

import {scale, verticalScale} from 'react-native-size-matters'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    height: verticalScale(70),
    backgroundColor: colors.background,
    elevation: 10,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: verticalScale(35),
  },
  activeTab: {
    width: 65,
    borderTopColor: colors.red,
    borderTopWidth: 3,
  },
  icon: {
    width: scale(24),
    height: scale(24),
  },
})

export default styles
