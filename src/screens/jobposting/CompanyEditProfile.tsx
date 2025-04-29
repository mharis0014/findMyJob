import React from 'react'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {SafeAreaView} from 'react-native-safe-area-context'

import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'

import {useEditCompanyProfile} from '../../hooks/useEditCompanyProfile'
import {useFetchCompanyProfile} from '../../hooks/useFetchCompanyProfile'

import {CustomButton, CustomLoader, CustomTextInput} from '../../components/common'

import {STRINGS} from '../../constants/strings'
import {CompanyAppStackParamList} from '../../constants/types'
import {companyEditProfileSchema} from '../../validation/schemas'
import {Text} from 'react-native-gesture-handler'
import styles from '../../styles/companyEditProfile.styles'
import LocalStorage from '../../utils/localStorage'
import CustomHeader from '../../components/common/CustomHeader'

type FormValues = yup.InferType<typeof companyEditProfileSchema>
type NavigationProp = NativeStackNavigationProp<CompanyAppStackParamList, 'CompanyEditProfile'>

const CompanyEditProfile = () => {
  const navigation = useNavigation<NavigationProp>()

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: yupResolver(companyEditProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      contact: '',
      companyName: '',
      address: '',
    },
  })

  const {loading, editCompanyProfile} = useEditCompanyProfile()

  useFetchCompanyProfile(reset)

  const onSubmit = async (data: FormValues) => {
    const onSuccess = async () => {
      LocalStorage.setItem('name', data.name)
      handleBackPress()
    }

    await editCompanyProfile(data, onSuccess)
    reset()
  }

  const handleBackPress = () => navigation.goBack()

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Profile" handleBackPress={handleBackPress} />

      <Text style={styles.title}>Edit Profile</Text>

      {/** Name */}
      <Controller
        control={control}
        name="name"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title={STRINGS.companySignup.fields.name}
            placeholder="xyz"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
          />
        )}
      />

      {/** Email */}
      <Controller
        control={control}
        name="email"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title={STRINGS.companySignup.fields.email}
            placeholder="xyz@gmail.com"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      {/** Contact */}
      <Controller
        control={control}
        name="contact"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title={STRINGS.companySignup.fields.contact}
            placeholder="92332*******"
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChange}
            error={errors.contact?.message}
          />
        )}
      />

      {/** Company Name */}
      <Controller
        control={control}
        name="companyName"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title={STRINGS.companySignup.fields.companyName}
            placeholder="ex. Google"
            value={value}
            onChangeText={onChange}
            error={errors.companyName?.message}
          />
        )}
      />

      {/** Address */}
      <Controller
        control={control}
        name="address"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title={STRINGS.companySignup.fields.address}
            placeholder="ex. Karachi"
            value={value}
            onChangeText={onChange}
            error={errors.address?.message}
          />
        )}
      />

      <CustomButton type="SOLID" title={'Update'} onPress={handleSubmit(onSubmit)} />
      <CustomLoader visible={loading} />
    </SafeAreaView>
  )
}

export default CompanyEditProfile
