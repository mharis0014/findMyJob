import React, {useCallback} from 'react'
import {View, Text, TouchableOpacity, Image, TextInput} from 'react-native'

import FastImage from 'react-native-fast-image'

import ICONS from '../../../constants/icons'
import ANIMATIONS from '../../../constants/animations'
import styles from '../../../styles/home.styles'
import {moderateScale} from 'react-native-size-matters'
import {CustomButton} from '../../../components/common'

const Home = () => {
  const handleLoginPress = useCallback(() => {
    // Navigate to login
  }, [])

  const handleRegisterPress = useCallback(() => {
    // Navigate to register
  }, [])

  const handleJobSearchPress = useCallback(() => {
    // Job Search Functionality
  }, [])

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
        <Image source={ICONS.search} style={styles.icon} />
        <Text style={styles.placeholder}>Search Jobs here...</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>You are one step away from getting a good Job</Text>

      <View style={styles.notes}>
        <Image source={ICONS.star} style={styles.icon} />
        <Text style={styles.note}>Get Jobs after creating account</Text>
      </View>

      <View style={styles.notes}>
        <Image source={ICONS.star} style={styles.icon} />
        <Text style={styles.note}>Chat with recruiter directly</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleLoginPress}
          activeOpacity={0.7}>
          <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleRegisterPress}
          activeOpacity={0.7}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Register</Text>
        </TouchableOpacity>
      </View>

      {/* Poster */}
      <View style={styles.jobSearchCard}>
        <FastImage
          source={ANIMATIONS.search}
          style={styles.gif}
          resizeMode={FastImage.resizeMode.contain}
        />

        <TextInput style={styles.input} placeholder="Enter Job Title" />
        <TextInput
          style={[styles.input, {marginTop: moderateScale(15)}]}
          placeholder="Enter Job Title"
        />

        <CustomButton type="SOLID" title="Search Jobs" onPress={handleJobSearchPress} />
      </View>
    </View>
  )
}

export default Home
