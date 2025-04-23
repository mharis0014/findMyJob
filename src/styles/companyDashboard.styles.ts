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
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: verticalScale(70),
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.background,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    shadowColor: colors.textColor,
    shadowOffset: {width: 0, height: -1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderTopWidth: 3,
    borderTopColor: 'transparent',
  },
  activeTab: {
    borderTopColor: colors.red,
  },
  icon: {
    width: scale(26),
    height: scale(26),
  },
})

export default styles
