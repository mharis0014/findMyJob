import React from 'react'

import CustomAlert from '../common/CustomAlert'

interface DeleteJobAlertProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

const DeleteJobAlert = ({visible, onConfirm, onCancel, loading = false}: DeleteJobAlertProps) => (
  <CustomAlert
    visible={visible}
    title="Delete Job"
    description="Are you sure you want to delete this job?"
    confirmText="Yes, Delete"
    cancelText="Cancel"
    onConfirm={onConfirm}
    onCancel={onCancel}
    loading={loading}
  />
)

export default DeleteJobAlert
