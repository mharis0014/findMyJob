import {NavigatorScreenParams} from '@react-navigation/native'

export type RootStackParamList = {
  Splash: undefined
  SelectUserType: undefined
  JobPostingNavigator: NavigatorScreenParams<JobPostingStackParamList>
  JobSearchingNavigator: undefined
}

export type JobPostingStackParamList = {
  CompanyLogin: undefined
  CompanySignup: undefined
  CompanyDashboard?: {
    id: string
    name: string
    email: string
  }
}
