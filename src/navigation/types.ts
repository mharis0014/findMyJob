import {NavigatorScreenParams} from '@react-navigation/native'

/**
 * Navigation type definitions for the entire app
 */

// Root Stack Navigator
export type RootStackParamList = {
  Splash: undefined
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>
  Auth: NavigatorScreenParams<AuthStackParamList>
  Main: NavigatorScreenParams<MainStackParamList>
}

// Onboarding Navigator (for first-time users)
export type OnboardingStackParamList = {
  Welcome: undefined
  Features: undefined
  Personalize: undefined
  Final: undefined
}

// Auth Navigator (when logged out)
export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  Verification: {email: string}
}

// Main Navigator (when logged in)
export type MainStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>
  JobDetail: {jobId: string}
  CompanyDetail: {companyId: string}
  ApplicationForm: {jobId: string}
  Chat: {chatId: string; recipientName: string}
  NotificationSettings: undefined
}

// Bottom Tab Navigator
export type BottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>
  JobSearchStack: NavigatorScreenParams<JobSearchStackParamList>
  ApplicationsStack: NavigatorScreenParams<ApplicationsStackParamList>
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>
}

// Home Stack Navigator
export type HomeStackParamList = {
  Home: undefined
  Notifications: undefined
  SearchHistory: undefined
}

// Job Search Stack Navigator
export type JobSearchStackParamList = {
  JobSearch: undefined
  JobFilters: undefined
  SavedSearches: undefined
}

// Applications Stack Navigator
export type ApplicationsStackParamList = {
  Applications: undefined
  ApplicationStats: undefined
  UpcomingInterviews: undefined
}

// Profile Stack Navigator
export type ProfileStackParamList = {
  Profile: undefined
  EditProfile: undefined
  Settings: undefined
  Help: undefined
}
