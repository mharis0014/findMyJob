import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {useApplications} from '../../hooks/useApplications'
import {ApplicationStatus} from '../../constants/types'
import {COLORS} from '../../constants/theme'

interface Props {
  visible: boolean
  onClose: () => void
  onSuccess?: () => void
}

/**
 * Component for adding a new job application to the tracker
 */
const AddJobApplication = ({visible, onClose, onSuccess}: Props) => {
  const {addApplication} = useApplications()
  const [loading, setLoading] = useState(false)

  // Form state
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobId, setJobId] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('applied')
  const [notes, setNotes] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [location, setLocation] = useState('')
  const [salary, setSalary] = useState('')

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [interviewDate, setInterviewDate] = useState<Date | null>(null)

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required'
    }

    if (!company.trim()) {
      newErrors.company = 'Company name is required'
    }

    if (contactEmail && !validateEmail(contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const applicationData = {
        jobTitle,
        company,
        jobId: jobId || `${company}-${Date.now()}`,
        status,
        notes,
        contactPerson,
        contactEmail,
        interviewDate,
        location,
        salary,
      }

      await addApplication(applicationData)

      // Reset form
      setJobTitle('')
      setCompany('')
      setJobId('')
      setStatus('applied')
      setNotes('')
      setContactPerson('')
      setContactEmail('')
      setInterviewDate(null)
      setLocation('')
      setSalary('')
      setErrors({})

      // Close modal and trigger success callback
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      console.error('Error adding application:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle interview date change
   */
  const handleDateChange = (event: Event, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setInterviewDate(selectedDate)
    }
  }

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Format date for display
   */
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Select a date'
    return date.toLocaleDateString()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Job Application</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Job Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Job Title *</Text>
              <TextInput
                style={[styles.textInput, errors.jobTitle ? styles.inputError : null]}
                value={jobTitle}
                onChangeText={setJobTitle}
                placeholder="e.g. Software Engineer"
              />
              {errors.jobTitle ? <Text style={styles.errorText}>{errors.jobTitle}</Text> : null}
            </View>

            {/* Company */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Company *</Text>
              <TextInput
                style={[styles.textInput, errors.company ? styles.inputError : null]}
                value={company}
                onChangeText={setCompany}
                placeholder="e.g. Google"
              />
              {errors.company ? <Text style={styles.errorText}>{errors.company}</Text> : null}
            </View>

            {/* Job ID/Link */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Job ID or Link (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={jobId}
                onChangeText={setJobId}
                placeholder="e.g. JOB-1234 or URL"
              />
            </View>

            {/* Application Status */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusButtonsContainer}>
                {(
                  ['applied', 'screening', 'interview', 'offer', 'rejected'] as ApplicationStatus[]
                ).map(statusOption => (
                  <TouchableOpacity
                    key={statusOption}
                    style={[
                      styles.statusButton,
                      status === statusOption && styles.statusButtonActive,
                    ]}
                    onPress={() => setStatus(statusOption)}>
                    <Text
                      style={[
                        styles.statusButtonText,
                        status === statusOption && styles.statusButtonTextActive,
                      ]}>
                      {statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Interview Date (conditional) */}
            {(status === 'interview' || status === 'offer') && (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Interview Date</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.dateText}>{formatDate(interviewDate)}</Text>
                  <Icon name="calendar" size={20} color={COLORS.primary} />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={interviewDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
            )}

            {/* Contact Person */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contact Person (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="e.g. John Doe"
              />
            </View>

            {/* Contact Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Contact Email (Optional)</Text>
              <TextInput
                style={[styles.textInput, errors.contactEmail ? styles.inputError : null]}
                value={contactEmail}
                onChangeText={setContactEmail}
                placeholder="e.g. john.doe@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.contactEmail ? (
                <Text style={styles.errorText}>{errors.contactEmail}</Text>
              ) : null}
            </View>

            {/* Location */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. New York, NY"
              />
            </View>

            {/* Salary */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Salary (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={salary}
                onChangeText={setSalary}
                placeholder="e.g. $120,000/year"
              />
            </View>

            {/* Notes */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes about this application"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Save Application</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 6,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333333',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
  },
  notesInput: {
    height: 100,
    paddingTop: 12,
  },
  statusButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonActive: {
    backgroundColor: COLORS.primary,
  },
  statusButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  datePickerButton: {
    height: 44,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333333',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default AddJobApplication
