import React from 'react'
import {Image, Text} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import {SafeAreaView} from 'react-native-safe-area-context'
import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'

import {CustomButton, CustomLoader, CustomTextInput} from '../../components/common'

import ICONS from '../../constants/icons'
import {STRINGS} from '../../constants/strings'
import {companyLoginSchema} from '../../validation/schemas'
import {JobPostingStackParamList} from '../../constants/types'
import styles from '../../styles/companyLogin.styles'
import {useCompanyLogin} from '../../hooks/useCompanyLogin'

type FormValues = yup.InferType<typeof companyLoginSchema>
type NavigationProp = NativeStackNavigationProp<JobPostingStackParamList, 'CompanyLogin'>

const CompanyLogin: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: yupResolver(companyLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const {loading, loginUser} = useCompanyLogin()

  const onSubmit = async (formData: FormValues) => {
    await loginUser(formData, navigation)
    reset()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={ICONS.logo} style={styles.logo} />
      <Text style={styles.title}>{STRINGS.companyLogin.title}</Text>

      {/** Email */}
      <Controller
        control={control}
        name="email"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title={STRINGS.companyLogin.fields.email}
            placeholder="xyz@gmail.com"
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
          />
        )}
      />

      {/** Password */}
      <Controller
        control={control}
        name="password"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title={STRINGS.companyLogin.fields.password}
            placeholder="********"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
          />
        )}
      />

      <Text style={styles.forgotPassword}>{STRINGS.companyLogin.buttons.forgotPassowrd}</Text>

      <CustomButton
        type="SOLID"
        title={STRINGS.companyLogin.buttons.login}
        onPress={handleSubmit(onSubmit)}
      />
      <CustomButton
        type="OUTLINED"
        title={STRINGS.companyLogin.buttons.signup}
        onPress={() => navigation.navigate('CompanySignup')}
      />

      <CustomLoader visible={loading} />
    </SafeAreaView>
  )
}

export default CompanyLogin
