import React from 'react'
import {View, Text, TouchableOpacity, Modal, StyleSheet, ActivityIndicator} from 'react-native'

import {colors} from '../../constants/colors'
import {CustomAlertProps} from '../../constants/types'

const CustomAlert = ({
  visible,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: CustomAlertProps) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}>
              <Text style={styles.buttonText}>{cancelText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton, loading && styles.disabledButton]}
              onPress={onConfirm}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>{confirmText}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: '80%',
    padding: 20,
    alignItems: 'center',
    elevation: 5, // Adding shadow for better visibility
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: colors.black,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: colors.gray,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
})

export default CustomAlert
