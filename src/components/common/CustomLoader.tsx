import React from 'react'
import {View, Modal, ActivityIndicator, StyleSheet, ModalProps} from 'react-native'

import {moderateScale, scale} from 'react-native-size-matters'

import {colors} from '../../constants/colors'

type CustomLoaderProps = {
  visible: boolean
  color?: string
  size?: 'small' | 'large'
  backgroundColor?: string
} & Partial<ModalProps>

const CustomLoader: React.FC<CustomLoaderProps> = ({
  visible,
  color = colors.black,
  size = 'large',
  backgroundColor = colors.background,
  ...modalProps
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent {...modalProps}>
      <View style={styles.overlay}>
        <View style={[styles.loaderContainer, {backgroundColor}]}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default CustomLoader
