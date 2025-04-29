import React, {useMemo, useState} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'

import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {SafeAreaView} from 'react-native-safe-area-context'

import {useForm, Controller} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'

import {
  CustomButton,
  CustomDropDown,
  CustomLoader,
  CustomModalSelector,
  CustomTextInput,
} from '../../components/common'

import ICONS from '../../constants/icons'
import {CompanyAppStackParamList, CompanyBottomTabsParamList, JobForm} from '../../constants/types'
import {JobSchema} from '../../validation/schemas'
import {profiles} from '../../data/profilesData'
import {useEditJob} from '../../hooks/useEditJob'
import styles from '../../styles/addJob.styles'

type NavigationProp = BottomTabNavigationProp<CompanyBottomTabsParamList, 'AddJob'>

const EditJob: React.FC = () => {
  const navigation = useNavigation<NavigationProp>()
  const route = useRoute<RouteProp<CompanyAppStackParamList, 'EditJob'>>()

  const {data} = route.params
  const {loading, editJob} = useEditJob()

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<JobForm>({
    defaultValues: {
      jobTitle: data.jobTitle,
      jobDesc: data.jobDesc,
      selectedCategory: data.category,
      selectedSkill: data.skill,
      experience: data.experience,
      salaryPackage: data.salaryPackage,
      company: data.company,
    },
    resolver: yupResolver(JobSchema),
  })

  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [skillModalVisible, setSkillModalVisible] = useState(false)

  const handleCategorySelect = (category: string) => {
    setValue('selectedCategory', category)
    setValue('selectedSkill', '')
  }

  const handleSuccess = () => navigation.goBack()

  const categoryOptions = useMemo(() => profiles.map(p => p.category), [])

  const skillOptions = useMemo(() => {
    const selectedProfile = profiles.find(p => p.category === control._formValues.selectedCategory)
    return selectedProfile?.keywords.map(skill => skill.join(' ')) || []
  }, [control._formValues.selectedCategory])

  const onSubmit = (formData: JobForm) => {
    editJob(formData, data.id, handleSuccess)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Image source={ICONS.close} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Job</Text>
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
      <CustomDropDown
        title="Category"
        placeholder={control._formValues.selectedCategory || 'Select Category'}
        onPress={() => setCategoryModalVisible(true)}
        error={errors.selectedCategory?.message}
      />

      {/* Skill Dropdown */}
      <CustomDropDown
        title="Skills"
        placeholder={control._formValues.selectedSkill || 'Select Skill'}
        onPress={() => setSkillModalVisible(true)}
        error={errors.selectedSkill?.message}
      />

      <Controller
        control={control}
        name="experience"
        render={({field: {onChange, value}}) => (
          <CustomTextInput
            title="Experience"
            placeholder="ex. Candidate should have 2-3 years of industrial experience"
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
      <CustomButton type="SOLID" title="Edit Job" onPress={handleSubmit(onSubmit)} />
      <CustomLoader visible={loading} />

      {/* Categories Modal */}
      <CustomModalSelector
        visible={categoryModalVisible}
        title="Select Category"
        data={categoryOptions}
        onSelect={category => {
          handleCategorySelect(category)
          setCategoryModalVisible(false)
        }}
        onClose={() => setCategoryModalVisible(false)}
      />

      {/* Skill Modal */}
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

export default EditJob
