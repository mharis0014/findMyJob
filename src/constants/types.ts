import {NavigatorScreenParams} from '@react-navigation/native'

// Navigation types for Root Navigator
export type RootStackParamList = {
  Splash: undefined
  SelectUserType: undefined
  JobPostingNavigator: NavigatorScreenParams<JobPostingStackParamList> | undefined
  JobSearchingNavigator: undefined
}

// Navigation types for Job Posting (Company) Stack Navigator
export type JobPostingStackParamList = {
  CompanyLogin: undefined
  CompanySignup: undefined
  CompanyAppNavigator: NavigatorScreenParams<CompanyAppStackParamList> | undefined
}

// Navigation types for Company Job Searching (User) Stack Navigator
export type JobSearchingStackParamList = {
  DrawerNavigator: NavigatorScreenParams<DrawerParamList> | undefined
}

// Navigation types for User Side (Job Posting) Drawer Navigator
export type DrawerParamList = {
  UserBottomTabsNavigator: NavigatorScreenParams<UserBottomTabParamList> | undefined
}

// Navigation types for User Side (Job Searching) Bottom Tab Navigator
export type UserBottomTabParamList = {
  Home: undefined
  JobApply: undefined
  Inbox: undefined
  Profile: undefined
}

// Navigation types for Company (Job Posting) App level Stack Navigator
export type CompanyAppStackParamList = {
  CompanyBottomTabsNavigator: undefined
  EditJob: undefined
  CompanyEditProfile: undefined
  RootNavigator: undefined
}

// Navigation types for Company (Job Posting) Bottom Tabs Navigator
export type CompanyBottomTabsParamList = {
  MyJobs: undefined
  SearchCandidates: undefined
  AddJob: undefined
  Chats: undefined
  CompanyProfile: undefined
}

// Jobs types for Add Job Form
export type JobForm = {
  jobTitle: string
  jobDesc: string
  selectedCategory: string
  selectedSkill: string
  experience: string
  salaryPackage: string
  company: string
}

// User Types for Company Side
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
  loading?: boolean
}
