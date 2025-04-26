import React, {useMemo, useState} from 'react'
import {View, Text, TouchableOpacity, Image} from 'react-native'

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native'
import {SafeAreaView} from 'react-native-safe-area-context'
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs'

import CustomTextInput from '../../components/CustomTextInput'
import CustomDropDown from '../../components/CustomDropDown'
import CustomButton from '../../components/CustomButton'
import CustomModalSelector from '../../components/CustomModalSelector'
import CustomLoader from '../../components/CustomLoader'

import ICONS from '../../constants/icons'
import {CompanyAppStackParamList, CompanyBottomTabsParamList, JobForm} from '../../constants/types'
import {profiles} from '../../data/profilesData'
import {useEditJob} from '../../hooks/useEditJob'
import styles from '../../styles/addJob.styles'

type NavigationProp = BottomTabNavigationProp<CompanyBottomTabsParamList, 'AddJob'>

const EditJob: React.FC = () => {
  const route = useRoute<RouteProp<CompanyAppStackParamList, 'EditJob'>>()
  const navigation = useNavigation<NavigationProp>()

  const {data} = route.params
  const {loading, editJob} = useEditJob()

  const [form, setForm] = useState<JobForm>({
    jobTitle: data.jobTitle,
    jobDesc: data.jobDesc,
    selectedCategory: data.category,
    selectedSkill: data.skill,
    experience: data.experience,
    salaryPackage: data.salaryPackage,
    company: data.company,
  })

  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [skillModalVisible, setSkillModalVisible] = useState(false)

  const handleChange = <K extends keyof JobForm>(key: K, value: JobForm[K]) => {
    setForm(prev => ({...prev, [key]: value}))
  }

  const handleCategorySelect = (category: string) => {
    handleChange('selectedCategory', category)
    handleChange('selectedSkill', '')
  }

  const categoryOptions = useMemo(() => profiles.map(p => p.category), [])

  const handleSuccess = () => navigation.goBack()

  const skillOptions = useMemo(() => {
    const selectedProfile = profiles.find(p => p.category === form.selectedCategory)
    return selectedProfile?.keywords.map(skill => skill.join(' ')) || []
  }, [form.selectedCategory])

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
      <CustomTextInput
        title={'Job Title'}
        placeholder="ex. Website Designer"
        value={form.jobTitle}
        onChangeText={text => handleChange('jobTitle', text)}
      />
      <CustomTextInput
        title="Job Description"
        placeholder="ex. We are looking for a skilled Website Designer for our Company"
        value={form.jobDesc}
        onChangeText={text => handleChange('jobDesc', text)}
      />

      {/* Category Dropdown */}
      <CustomDropDown
        title="Category"
        placeholder={form.selectedCategory || 'Select Category'}
        onPress={() => setCategoryModalVisible(true)}
      />

      {/* Skill Dropdown */}
      <CustomDropDown
        title="Skills"
        placeholder={form.selectedSkill || 'Select Skill'}
        onPress={() => setSkillModalVisible(true)}
      />
      <CustomTextInput
        title="Experience"
        placeholder="ex. candidate should have 2-3 Years of industrial experience"
        value={form.experience}
        onChangeText={text => handleChange('experience', text)}
      />
      <CustomTextInput
        title="Salary Package"
        placeholder="ex. 2 Lac"
        keyboardType="number-pad"
        value={form.salaryPackage}
        onChangeText={text => handleChange('salaryPackage', text)}
      />
      <CustomTextInput
        title="Company"
        placeholder="ex. Google"
        value={form.company}
        onChangeText={text => handleChange('company', text)}
      />

      {/* Submit Button */}
      <CustomButton
        type="SOLID"
        title="Edit Job"
        onPress={() => editJob(form, data.id, handleSuccess)}
      />
      <CustomLoader visible={loading} />

      {/* Categories DropDown Modal */}
      <CustomModalSelector
        visible={categoryModalVisible}
        title="Select Category"
        data={categoryOptions}
        onSelect={handleCategorySelect}
        onClose={() => setCategoryModalVisible(false)}
      />

      {/* Skills DropDown Modal */}
      <CustomModalSelector
        visible={skillModalVisible}
        title="Select Skill"
        data={skillOptions}
        onSelect={skill => handleChange('selectedSkill', skill)}
        onClose={() => setSkillModalVisible(false)}
      />
    </SafeAreaView>
  )
}

export default EditJob
