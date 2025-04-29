import React from 'react'

import CustomAlert from '../common/CustomAlert'

interface DeleteJobAlertProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteJobAlert = ({visible, onConfirm, onCancel}: DeleteJobAlertProps) => (
  <CustomAlert
    visible={visible}
    title="Delete Job"
    description="Are you sure you want to delete this job?"
    confirmText="Yes, Delete"
    cancelText="Cancel"
    onConfirm={onConfirm}
    onCancel={onCancel}
  />
)

export default DeleteJobAlert
