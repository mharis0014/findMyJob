import React, {useEffect, useState} from 'react'
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native'

import {useIsFocused, useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import ActionButton from '../../../components/common/ActionButton'
import ImagePickerModal from '../../../components/common/ImagePickerModal'
import ProfileItem from '../../../components/profile/ProfileItem'

import {colors} from '../../../constants/colors'
import ICONS from '../../../constants/icons'
import LocalStorage from '../../../utils/localStorage'
import {CompanyBottomTabsParamList} from '../../../constants/types'
import styles from '../../../styles/companyProfile.styles'
import {uploadImageToCloudinary} from '../../../utils/uploadImageToCloudinary'

type NavigationProp = NativeStackNavigationProp<CompanyBottomTabsParamList, 'CompanyProfile'>

const CompanyProfile = () => {
  const navigation = useNavigation<NavigationProp>()
  const isFocused = useIsFocused()
  const [name, setName] = useState<string>('')
  const [jobs, setJobs] = useState<unknown[]>([])
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    if (isFocused) getData()
  }, [isFocused])

  const getData = async () => {
    const username = await LocalStorage.getItem('name')
    const userJobs = await LocalStorage.getItem('jobs')
    const savedProfilePic = await LocalStorage.getItem('profilePic')

    setName(username || 'Company Name')
    setJobs(userJobs ? JSON.parse(userJobs) : [])
    if (savedProfilePic) setProfilePic(savedProfilePic)
  }

  const handleImageUpload = async (imageUri: string, fileName: string) => {
    try {
      const response = await uploadImageToCloudinary({
        uri: imageUri,
        fileName: fileName,
      })
      console.log('Image uploaded successfully:', response.secure_url)
    } catch (error) {
      console.error('Image upload failed:', error)
    }
  }

  const handleMyJobsPress = () => navigation.navigate('MyJobs')
  const handleEditProfilePress = () => navigation.getParent()?.navigate('CompanyEditProfile')

  const handleImageSelect = (uri: string) => {
    const fileName = `profile_pic_${new Date().getTime()}.jpg`

    setProfilePic(uri)
    handleImageUpload(uri, fileName)
    LocalStorage.setItem('profilePic', uri)
  }

  const handleChangeProfilePicPress = () => setIsModalVisible(true)
  const handleCloseModal = () => setIsModalVisible(false)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <Text style={styles.headerTitle}>FindMyJob</Text>

      {/* Profile Picture */}
      <TouchableOpacity style={styles.profilePicContainer} activeOpacity={0.8}>
        <Image source={profilePic ? {uri: profilePic} : ICONS.user} style={styles.profilePic} />
      </TouchableOpacity>

      {/* Name */}
      <Text style={styles.name}>{name}</Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <ActionButton
          title="Edit Profile"
          backgroundColor={colors.primary}
          onPress={handleEditProfilePress}
        />
        <ActionButton
          title="Change Picture"
          backgroundColor={colors.darkGray}
          onPress={handleChangeProfilePicPress}
        />
      </View>

      {/* Profile Options */}
      <View style={styles.profileOptions}>
        <ProfileItem
          icon={ICONS.jobs}
          title={`My Jobs (${jobs.length})`}
          onPress={handleMyJobsPress}
        />
        <ProfileItem icon={ICONS.contact_us} title={'Contact Us'} onPress={() => {}} />
        <ProfileItem icon={ICONS.theme} title={'App Theme'} onPress={() => {}} />
        <ProfileItem icon={ICONS.logout} title={'Logout'} onPress={() => {}} />
      </View>

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onImageSelect={handleImageSelect}
      />
    </ScrollView>
  )
}

export default CompanyProfile
