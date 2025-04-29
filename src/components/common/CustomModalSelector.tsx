import React from 'react'
import {Modal, View, FlatList, Text, TouchableOpacity} from 'react-native'

import styles from '../../styles/addJob.styles'

type Props = {
  visible: boolean
  title: string
  data: string[]
  onSelect: (value: string) => void
  onClose: () => void
}

const CustomModalSelector = ({visible, title, data, onSelect, onClose}: Props) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalMainView}>
      <View style={styles.listingView}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={(item, index) => `${title}-${index}`}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.profileItem}
              onPress={() => {
                onSelect(item)
                onClose()
              }}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  </Modal>
)

export default CustomModalSelector
