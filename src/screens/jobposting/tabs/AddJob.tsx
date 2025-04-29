import React, {useMemo, useState} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'

import {useNavigation} from '@react-navigation/native'
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import {SafeAreaView} from 'react-native-safe-area-context'

import {useForm, Controller} from 'react-hook-form'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'

import {
  CustomButton,
  CustomDropDown,
  CustomLoader,
  CustomModalSelector,
  CustomTextInput,
} from '../../../components/common'

import ICONS from '../../../constants/icons'
import {profiles} from '../../../data/profilesData'
import {JobSchema} from '../../../validation/schemas'
import {CompanyBottomTabsParamList} from '../../../constants/types'
import styles from '../../../styles/addJob.styles'
import {usePostJob} from '../../../hooks/usePostJob'

type FormValues = yup.InferType<typeof JobSchema>
type NavigationProp = BottomTabNavigationProp<CompanyBottomTabsParamList, 'AddJob'>

const AddJob: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const {loading, postJob} = usePostJob()

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {errors},
  } = useForm<FormValues>({
    resolver: yupResolver(JobSchema),
    defaultValues: {
      jobTitle: '',
      jobDesc: '',
      selectedCategory: '',
      selectedSkill: '',
      experience: '',
      salaryPackage: '',
      company: '',
    },
  })

  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [skillModalVisible, setSkillModalVisible] = useState(false)

  const selectedCategory = watch('selectedCategory')

  const skillOptions = useMemo(() => {
    const selectedProfile = profiles.find(p => p.category === selectedCategory)
    return selectedProfile?.keywords.map(skill => skill.join(' ')) || []
  }, [selectedCategory])

  const onSubmit = async (formData: FormValues) => {
    await postJob(formData)
    reset()
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Image source={ICONS.close} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Post Job</Text>
      </View>

      {/* Form Inputs */}
      <Controller
        control={control}
        name="jobTitle"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title="Job Title"
            placeholder="ex. Website Designer"
            value={value}
            onChangeText={onChange}
            error={errors.jobTitle?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="jobDesc"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title="Job Description"
            placeholder="ex. We are looking for a skilled Website Designer for our Company"
            value={value}
            onChangeText={onChange}
            error={errors.jobDesc?.message}
          />
        )}
      />

      {/* Category Dropdown */}
      <Controller
        control={control}
        name="selectedCategory"
        render={({field: {value}}) => (
          <CustomDropDown
            title="Category"
            placeholder={value || 'Select Category'}
            onPress={() => setCategoryModalVisible(true)}
            error={errors.selectedCategory?.message}
          />
        )}
      />

      {/* Skill Dropdown */}
      <Controller
        control={control}
        name="selectedSkill"
        render={({field: {value}}) => (
          <CustomDropDown
            title="Skills"
            placeholder={value || 'Select Skill'}
            onPress={() => setSkillModalVisible(true)}
            error={errors.selectedSkill?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="experience"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title="Experience"
            placeholder="ex. candidate should have 2-3 Years of industrial experience"
            value={value}
            onChangeText={onChange}
            error={errors.experience?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="salaryPackage"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title="Salary Package"
            placeholder="ex. 2 Lac"
            keyboardType="number-pad"
            value={value}
            onChangeText={onChange}
            error={errors.salaryPackage?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="company"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title="Company"
            placeholder="ex. Google"
            value={value}
            onChangeText={onChange}
            error={errors.company?.message}
          />
        )}
      />

      {/* Submit Button */}
      <CustomButton type="SOLID" title="Post Job" onPress={handleSubmit(onSubmit)} />
      <CustomLoader visible={loading} />

      {/* Categories DropDown Modal */}
      <CustomModalSelector
        visible={categoryModalVisible}
        title="Select Category"
        data={profiles.map(p => p.category)}
        onSelect={category => {
          setValue('selectedCategory', category)
          setValue('selectedSkill', '') // Reset selected skill
          setCategoryModalVisible(false)
        }}
        onClose={() => setCategoryModalVisible(false)}
      />

      {/* Skills DropDown Modal */}
      <CustomModalSelector
        visible={skillModalVisible}
        title="Select Skill"
        data={skillOptions}
        onSelect={skill => {
          setValue('selectedSkill', skill)
          setSkillModalVisible(false)
        }}
        onClose={() => setSkillModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default AddJob
