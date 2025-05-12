/**
 * Push Notification Service
 *
 * Handles push notification registration, permissions, and display
 * for both iOS and Android platforms.
 */

import {Platform, PermissionsAndroid, Alert} from 'react-native'
import messaging from '@react-native-firebase/messaging'
import firestore from '@react-native-firebase/firestore'
import PushNotification from 'react-native-push-notification'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import {useState, useEffect} from 'react'

import LocalStorage from '../utils/localStorage'
import analytics from './analytics'
import {EventCategory} from './analytics'
import apiClient from './api'

// Define notification channels for Android
const CHANNELS = {
  JOB_ALERTS: {
    id: 'job-alerts',
    name: 'Job Alerts',
    description: 'Notifications about new job opportunities',
    importance: 4, // HIGH
    vibration: true,
  },
  MESSAGES: {
    id: 'messages',
    name: 'Messages',
    description: 'Chat and direct messages',
    importance: 4, // HIGH
    vibration: true,
    sound: true,
  },
  UPDATES: {
    id: 'updates',
    name: 'App Updates',
    description: 'Information about app updates and features',
    importance: 3, // DEFAULT
    vibration: false,
  },
}

// Create a type for notification data
export interface NotificationData {
  title: string
  body: string
  data?: Record<string, string>
  channelId?: string
  sound?: string
  badge?: number
  silent?: boolean
}

// Type definition for received notifications from the library
// Using import type would be better, but for now using a more compatible approach
type ReceivedNotification = {
  foreground: boolean
  userInteraction: boolean
  message: string | object
  data?: Record<string, string | number | boolean | null | undefined>
  badge?: number
  alert?: string | object
  sound?: string
  finish?: (response: string) => void
  userInfo?: Record<string, unknown>
}

// Application related types
interface ApplicationType {
  id: string
  userId: string
  jobId: string
  status: 'pending' | 'interviewing' | 'rejected' | 'offered'
  appliedAt: ReturnType<typeof firestore.Timestamp.now>
  updatedAt: ReturnType<typeof firestore.Timestamp.now>
  notes?: string
}

// Resume parsing types
interface ParsedResume {
  name: string
  email: string
  phone?: string
  skills?: string[]
  experience?: string
  education?: string[]
}

interface FormField {
  id: string
  label: string
  type: string
  required?: boolean
}

// Main notification service class
class NotificationService {
  private isInitialized = false
  private deviceToken: string | null = null

  /**
   * Initialize the notification service
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) return

    // Configure notification settings
    this.configureNotifications()

    // Set up notification listeners
    this.setupNotificationListeners()

    // Request permissions
    await this.requestPermissions()

    // Get and store the FCM token
    await this.getToken()

    this.isInitialized = true
  }

  /**
   * Configure notification settings
   */
  private configureNotifications(): void {
    // Configure Android channels
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: CHANNELS.JOB_ALERTS.id,
          channelName: CHANNELS.JOB_ALERTS.name,
          channelDescription: CHANNELS.JOB_ALERTS.description,
          importance: CHANNELS.JOB_ALERTS.importance,
          vibrate: CHANNELS.JOB_ALERTS.vibration,
        },
        created => console.log(`Job Alerts channel created: ${created}`),
      )

      PushNotification.createChannel(
        {
          channelId: CHANNELS.MESSAGES.id,
          channelName: CHANNELS.MESSAGES.name,
          channelDescription: CHANNELS.MESSAGES.description,
          importance: CHANNELS.MESSAGES.importance,
          vibrate: CHANNELS.MESSAGES.vibration,
          playSound: CHANNELS.MESSAGES.sound,
          soundName: 'default',
        },
        created => console.log(`Messages channel created: ${created}`),
      )

      PushNotification.createChannel(
        {
          channelId: CHANNELS.UPDATES.id,
          channelName: CHANNELS.UPDATES.name,
          channelDescription: CHANNELS.UPDATES.description,
          importance: CHANNELS.UPDATES.importance,
          vibrate: CHANNELS.UPDATES.vibration,
        },
        created => console.log(`Updates channel created: ${created}`),
      )
    }

    // Configure general settings
    PushNotification.configure({
      // Called when a remote or local notification is opened or received
      onNotification: this.onNotificationReceived.bind(this),

      // Called when the user taps on a notification
      onRegister: ({token}) => {
        this.deviceToken = token
        LocalStorage.setItem('pushToken', token)
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      // Request permissions on iOS
      requestPermissions: Platform.OS === 'ios',
    })
  }

  /**
   * Set up Firebase messaging listeners
   */
  private setupNotificationListeners(): void {
    // Handle notifications when app is in foreground
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage)

      // Track notification received in analytics
      analytics.trackEvent({
        eventName: 'notification_received',
        category: EventCategory.ENGAGEMENT,
        properties: {
          notification_type: (remoteMessage.data?.type as string) || 'unknown',
          is_foreground: true,
        },
      })

      // Display the notification even when in foreground
      this.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data as Record<string, string>,
        channelId: this.getChannelIdFromType(remoteMessage.data?.type as string),
      })
    })

    // Handle notification open when app is in background/quit state
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Background notification opened:', remoteMessage)

      // Track notification opened in analytics
      analytics.trackEvent({
        eventName: 'notification_opened',
        category: EventCategory.ENGAGEMENT,
        properties: {
          notification_type: (remoteMessage.data?.type as string) || 'unknown',
          app_state: 'background',
        },
      })

      // Handle notification tap action
      this.handleNotificationAction(remoteMessage.data as Record<string, string>)
    })

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from quit state notification:', remoteMessage)

          // Track app open from notification in analytics
          analytics.trackEvent({
            eventName: 'app_opened_from_notification',
            category: EventCategory.ENGAGEMENT,
            properties: {
              notification_type: (remoteMessage.data?.type as string) || 'unknown',
            },
          })

          // Handle notification tap action
          this.handleNotificationAction(remoteMessage.data as Record<string, string>)
        }
      })
      .catch(err => console.error('Failed to get initial notification:', err))
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          // Android 13+ requires POST_NOTIFICATIONS permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
            {
              title: 'Notification Permission',
              message: 'FindMyJob needs to send you notifications for job updates and messages.',
              buttonPositive: 'Allow',
              buttonNegative: 'Cancel',
            },
          )
          return granted === PermissionsAndroid.RESULTS.GRANTED
        } else {
          // Older Android versions don't need explicit permission
          return true
        }
      } else if (Platform.OS === 'ios') {
        // iOS permission request
        const authStatus = await messaging().requestPermission({
          sound: true,
          alert: true,
          badge: true,
        })

        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        )
      }
      return false
    } catch (error) {
      console.error('Error requesting notification permissions:', error)
      return false
    }
  }

  /**
   * Get the FCM token and store it
   */
  private async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken()
      console.log('FCM Token:', token)
      this.deviceToken = token
      await LocalStorage.setItem('pushToken', token)
      return token
    } catch (error) {
      console.error('Error getting FCM token:', error)
      return null
    }
  }

  /**
   * Handle received notification
   */
  private onNotificationReceived(notification: ReceivedNotification): void {
    // Log notification
    console.log('Notification received:', notification)

    // Track in analytics
    analytics.trackEvent({
      eventName: 'notification_received',
      category: EventCategory.ENGAGEMENT,
      properties: {
        notification_type: notification.data?.type || 'unknown',
        is_foreground: notification.foreground || false,
      },
    })

    // Emit completion for iOS
    if (Platform.OS === 'ios' && notification.finish) {
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    }

    // Handle the notification if the user tapped on it
    if (notification.userInteraction) {
      // Convert notification data to string values for compatibility
      const stringData = notification.data
        ? Object.entries(notification.data).reduce(
            (acc, [key, value]) => {
              acc[key] = String(value ?? '')
              return acc
            },
            {} as Record<string, string>,
          )
        : {}

      this.handleNotificationAction(stringData)
    }
  }

  /**
   * Display a local notification
   */
  public displayNotification({
    title,
    body,
    data = {},
    channelId,
    sound = 'default',
    badge,
    silent = false,
  }: NotificationData): void {
    const notificationOptions = {
      title,
      message: body,
      data,
      playSound: !silent,
      soundName: sound,
      userInteraction: false,
    }

    // Add platform-specific options
    if (Platform.OS === 'android') {
      Object.assign(notificationOptions, {
        channelId: channelId || CHANNELS.UPDATES.id,
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        color: '#1A8CFF', // Primary color
        vibrate: true,
        ongoing: false,
        autoCancel: true,
      })
    } else if (Platform.OS === 'ios') {
      Object.assign(notificationOptions, {
        category: data.type || 'default',
        badge: badge || 1,
      })
    }

    // Display the notification
    PushNotification.localNotification(notificationOptions)
  }

  /**
   * Handle notification action (when user taps on a notification)
   */
  private handleNotificationAction(data: Record<string, string>): void {
    // Extract notification type and related data
    const notificationType = data.type

    // Perform different actions based on notification type
    switch (notificationType) {
      case 'job_alert':
        // Navigate to job details
        if (data.jobId) {
          // Navigation would happen here in a real implementation
          console.log(`Navigate to job with ID: ${data.jobId}`)
        }
        break

      case 'message':
        // Navigate to chat
        if (data.chatId) {
          console.log(`Navigate to chat with ID: ${data.chatId}`)
        }
        break

      case 'application_update':
        // Navigate to applications
        console.log('Navigate to applications screen')
        break

      default:
        // Default action
        console.log('No specific action for this notification type')
    }

    // Track notification action in analytics
    analytics.trackEvent({
      eventName: 'notification_action',
      category: EventCategory.USER_ACTION,
      properties: {
        notification_type: notificationType || 'unknown',
        ...data,
      },
    })
  }

  /**
   * Get the appropriate channel ID based on notification type
   */
  private getChannelIdFromType(type?: string): string {
    if (!type) return CHANNELS.UPDATES.id

    switch (type) {
      case 'job_alert':
        return CHANNELS.JOB_ALERTS.id
      case 'message':
        return CHANNELS.MESSAGES.id
      default:
        return CHANNELS.UPDATES.id
    }
  }

  /**
   * Register for topic-based notifications
   */
  public async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic)
      console.log(`Subscribed to topic: ${topic}`)
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error)
    }
  }

  /**
   * Unregister from topic-based notifications
   */
  public async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic)
      console.log(`Unsubscribed from topic: ${topic}`)
    } catch (error) {
      console.error(`Failed to unsubscribe from topic ${topic}:`, error)
    }
  }

  /**
   * Schedule a local notification for a future time
   */
  public scheduleNotification({
    title,
    body,
    data = {},
    channelId,
    date,
  }: NotificationData & {date: Date}): void {
    const notificationOptions = {
      title,
      message: body,
      date,
      data,
      playSound: true,
      soundName: 'default',
    }

    // Add platform-specific options
    if (Platform.OS === 'android') {
      Object.assign(notificationOptions, {
        channelId: channelId || CHANNELS.UPDATES.id,
        smallIcon: 'ic_notification',
        largeIcon: 'ic_launcher',
        color: '#1A8CFF',
      })
    }

    // Schedule the notification
    PushNotification.localNotificationSchedule(notificationOptions)
  }

  /**
   * Cancel all pending notifications
   */
  public cancelAllNotifications(): void {
    PushNotification.cancelAllLocalNotifications()
    if (Platform.OS === 'ios') {
      PushNotificationIOS.removeAllDeliveredNotifications()
    }
  }

  /**
   * Update badge number (iOS only)
   */
  public setBadgeNumber(count: number): void {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(count)
    }
  }

  /**
   * Reset badge number to zero (iOS only)
   */
  public resetBadgeNumber(): void {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0)
    }
  }

  /**
   * Show the notification permissions request with custom UI
   */
  public showPermissionRequest(): void {
    Alert.alert(
      'Stay Updated',
      'Enable notifications to get job alerts, messages, and application updates.',
      [
        {
          text: 'Not Now',
          style: 'cancel',
        },
        {
          text: 'Enable',
          onPress: () => this.requestPermissions(),
        },
      ],
      {cancelable: false},
    )
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService()
export default notificationService

// Resume parser service
export const parseResume = async (resumeFile: string): Promise<ParsedResume> => {
  try {
    const formData = new FormData()
    formData.append('resume', {
      uri: resumeFile,
      name: 'resume.pdf',
      type: 'application/pdf',
    })

    const response: {data: ParsedResume} = await apiClient.post('/resume/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error parsing resume:', error)
    throw error
  }
}

// Auto-fill application form
export const autoFillApplication = (
  parsedResume: ParsedResume,
  formFields: FormField[],
): Record<string, string> => {
  const formData: Record<string, string> = {}

  formFields.forEach(field => {
    switch (field.id) {
      case 'name':
        formData[field.id] = parsedResume.name
        break
      case 'email':
        formData[field.id] = parsedResume.email
        break
      // Map other fields
    }
  })

  return formData
}

// Job application tracking hook
export const useApplicationTracking = (userId: string) => {
  const [applications, setApplications] = useState<ApplicationType[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interviewing: 0,
    rejected: 0,
    offered: 0,
  })

  useEffect(() => {
    if (!userId) return

    const unsubscribe = firestore()
      .collection('applications')
      .where('userId', '==', userId)
      .orderBy('appliedAt', 'desc')
      .onSnapshot(snapshot => {
        const applicationList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as ApplicationType[]

        setApplications(applicationList)

        // Calculate stats
        const newStats = {
          total: applicationList.length,
          pending: applicationList.filter(app => app.status === 'pending').length,
          interviewing: applicationList.filter(app => app.status === 'interviewing').length,
          rejected: applicationList.filter(app => app.status === 'rejected').length,
          offered: applicationList.filter(app => app.status === 'offered').length,
        }

        setStats(newStats)
      })

    return unsubscribe
  }, [userId])

  // Add notes or update application status
  const updateApplication = async (appId: string, updates: Partial<ApplicationType>) => {
    try {
      await firestore()
        .collection('applications')
        .doc(appId)
        .update({
          ...updates,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        })
      return true
    } catch (err) {
      console.error('Failed to update application:', err)
      return false
    }
  }

  return {applications, stats, updateApplication}
}
