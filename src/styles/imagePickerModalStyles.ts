import {StyleSheet} from 'react-native'

import {colors} from '../constants/colors'

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    padding: 20,
    paddingBottom: 35,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 22,
    right: 22,
  },
  closeIcon: {
    width: 18,
    height: 18,
    tintColor: colors.textPrimary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
})

export default styles
