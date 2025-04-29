import React from 'react'
import {Modal, View, Text, TouchableOpacity, Image} from 'react-native'

import {launchImageLibrary, launchCamera} from 'react-native-image-picker'

import CustomButton from './CustomButton'

import ICONS from '../../constants/icons'
import styles from '../../styles/imagePickerModalStyles'

type Props = {
  visible: boolean
  onClose: () => void
  onImageSelect: (uri: string) => void
}

const ImagePickerModal: React.FC<Props> = ({visible, onClose, onImageSelect}) => {
  const handleGalleryPress = () => {
    launchImageLibrary({mediaType: 'photo', quality: 0.5}, response => {
      if (!response.didCancel && response.assets && response.assets[0].uri) {
        onImageSelect(response.assets[0].uri)
        onClose()
      }
    })
  }

  const handleCameraPress = () => {
    launchCamera({mediaType: 'photo', quality: 0.5}, response => {
      if (!response.didCancel && response.assets && response.assets[0].uri) {
        onImageSelect(response.assets[0].uri)
        onClose()
      }
    })
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Image source={ICONS.close} style={styles.closeIcon} />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>Select Profile Picture</Text>

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Upload from Gallery"
              type="OUTLINED"
              onPress={handleGalleryPress}
            />
            <CustomButton title="Capture from Camera" type="SOLID" onPress={handleCameraPress} />
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ImagePickerModal
