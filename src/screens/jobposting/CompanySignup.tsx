import React from 'react'
import {Image, Text, ScrollView} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import {SafeAreaView} from 'react-native-safe-area-context'
import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'

import ICONS from '../../constants/icons'
import {STRINGS} from '../../constants/strings'
import {companySignupSchema} from '../../validation/schemas'
import {JobPostingStackParamList} from '../../constants/types'
import CustomLoader from '../../components/CustomLoader'
import styles from '../../styles/companySignup.styles'
import {useCompanySignup} from '../../hooks/useCompanySignup'

type FormValues = yup.InferType<typeof companySignupSchema>
type NavigationProp = NativeStackNavigationProp<JobPostingStackParamList, 'CompanyLogin'>

const CompanySignup: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: yupResolver(companySignupSchema),
    defaultValues: {
      name: '',
      email: '',
      contact: '',
      companyName: '',
      address: '',
      password: '',
    },
  })

  const {loading, registerCompany} = useCompanySignup()

  const onSubmit = (data: FormValues) => {
    registerCompany(data, navigation)
    reset()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <Image
          source={ICONS.logo}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="App Logo"
        />
        <Text style={styles.title}>{STRINGS.companySignup.title}</Text>

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

        {/** Password */}
        <Controller
          control={control}
          name="password"
          render={({field: {onChange, value}}) => (
            <CustomTextInput
              title={STRINGS.companySignup.fields.password}
              placeholder="********"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        <CustomButton
          type="SOLID"
          title={STRINGS.companySignup.buttons.signup}
          onPress={handleSubmit(onSubmit)}
        />
        <CustomButton
          type="OUTLINED"
          title={STRINGS.companySignup.buttons.login}
          onPress={() => navigation.goBack()}
        />
      </ScrollView>

      <CustomLoader visible={loading} />
    </SafeAreaView>
  )
}

export default CompanySignup
