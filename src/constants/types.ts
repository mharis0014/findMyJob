import {NavigatorScreenParams} from '@react-navigation/native'

export type RootStackParamList = {
  Splash: undefined
  SelectUserType: undefined
  JobPostingNavigator: NavigatorScreenParams<JobPostingStackParamList> | undefined
  JobSearchingNavigator: undefined
}

export type JobPostingStackParamList = {
  CompanyLogin: undefined
  CompanySignup: undefined
  CompanyAppNavigator: undefined
}

export type CompanyAppStackParamList = {
  CompanyBottomTabsNavigator: undefined
  EditJob: undefined
  CompanyEditProfile: undefined
}

export type CompanyBottomTabsParamList = {
  MyJobs: undefined
  SearchCandidates: undefined
  AddJob: undefined
  Chats: undefined
  CompanyProfile: undefined
}

export type JobForm = {
  jobTitle: string
  jobDesc: string
  selectedCategory: string
  selectedSkill: string
  experience: string
  salaryPackage: string
  company: string
}

export type CompnayUserType = {
  id: string
  name: string
  email: string
  contact: string
  companyName: string
  address: string
  password: string
}

export type CompanyProfileUpdateType = {
  name: string
  email: string
  contact: string
  companyName: string
  address: string
}

export type JobType = {
  id: string
  jobTitle: string
  jobDesc: string
  salaryPackage: string
  category: string
  skill: string
}

export type CustomAlertProps = {
  visible: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
}
