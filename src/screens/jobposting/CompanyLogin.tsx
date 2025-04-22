import React from 'react'
import {StyleSheet, Image, Text} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import {SafeAreaView} from 'react-native-safe-area-context'
import {moderateScale, moderateVerticalScale, scale} from 'react-native-size-matters'
import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'

import {colors} from '../../constants/colors'
import ICONS from '../../constants/icons'
import {STRINGS} from '../../constants/strings'
import {companyLoginSchema} from '../../validation/schemas'
import {JobPostingStackParamList} from '../../constants/types'

type FormValues = yup.InferType<typeof companyLoginSchema>
type NavigationProp = NativeStackNavigationProp<JobPostingStackParamList, 'CompanyLogin'>

const CompanyLogin: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: yupResolver(companyLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: FormValues) => {
    console.log('Submitted data:', data)
    // handle API call or navigation here
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  logo: {
    width: scale(80),
    height: scale(70),
    marginTop: moderateVerticalScale(40),
    alignSelf: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    alignSelf: 'center',
    fontWeight: '900',
    marginTop: moderateVerticalScale(50),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: moderateScale(20),
    marginTop: moderateVerticalScale(10),
    fontWeight: '700',
    fontSize: moderateScale(14),
  },
})

export default CompanyLogin
