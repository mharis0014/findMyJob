/**
 * Deep linking configuration for the app
 *
 * This enables opening the app from URLs or universal links
 */

import {LinkingOptions} from '@react-navigation/native'
import {RootStackParamList} from './types'

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['findmyjob://', 'https://findmyjob.com'],
  config: {
    initialRouteName: 'Splash',
    screens: {
      Main: {
        screens: {
          BottomTabs: {
            screens: {
              HomeStack: {
                initialRouteName: 'Home',
                screens: {
                  Home: 'home',
                  Notifications: 'notifications',
                  SearchHistory: 'search-history',
                },
              },
              JobSearchStack: {
                initialRouteName: 'JobSearch',
                screens: {
                  JobSearch: 'jobs',
                  JobFilters: 'jobs/filters',
                  SavedSearches: 'jobs/saved-searches',
                },
              },
              ApplicationsStack: {
                initialRouteName: 'Applications',
                screens: {
                  Applications: 'applications',
                  ApplicationStats: 'applications/stats',
                  UpcomingInterviews: 'applications/interviews',
                },
              },
              ProfileStack: {
                initialRouteName: 'Profile',
                screens: {
                  Profile: 'profile',
                  EditProfile: 'profile/edit',
                  Settings: 'profile/settings',
                  Help: 'help',
                },
              },
            },
          },
          JobDetail: 'job/:jobId',
          CompanyDetail: 'company/:companyId',
          ApplicationForm: 'apply/:jobId',
          Chat: 'chat/:chatId',
          NotificationSettings: 'settings/notifications',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
          Verification: 'verify/:email',
        },
      },
      Onboarding: {
        screens: {
          Welcome: 'welcome',
          Features: 'features',
          Personalize: 'personalize',
          Final: 'final',
        },
      },
    },
  },
}
