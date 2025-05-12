/**
 * Analytics service for tracking user behavior and app performance
 *
 * This module provides a wrapper for analytics tracking with support for:
 * - Screen views
 * - User events
 * - Error logging
 * - Performance metrics
 * - User properties
 *
 * In a production app, this would connect to services like Firebase Analytics,
 * Amplitude, or other analytics platforms.
 */

import Performance from '../utils/performance'

// Analytics event categories for organization
export enum EventCategory {
  NAVIGATION = 'navigation',
  USER_ACTION = 'user_action',
  ENGAGEMENT = 'engagement',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  CONVERSION = 'conversion',
}

// Types for analytics tracking
interface EventProperties {
  [key: string]: string | number | boolean | null | undefined
}

interface UserProperties {
  [key: string]: string | number | boolean | null | undefined
}

interface ScreenViewParams {
  screenName: string
  screenClass?: string
  previousScreen?: string
  properties?: EventProperties
}

interface EventParams {
  eventName: string
  category: EventCategory
  properties?: EventProperties
}

interface ErrorParams {
  errorName: string
  errorMessage: string
  componentStack?: string
  jsEngine?: string
  platform?: string
  properties?: EventProperties
}

// Main analytics class
class AnalyticsService {
  private isEnabled = true
  private userId: string | null = null
  private userProperties: UserProperties = {}
  private sessionId: string
  private lastScreenName: string | null = null

  constructor() {
    // Generate a unique session ID
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`

    // Add startup event
    this.trackEvent({
      eventName: 'app_start',
      category: EventCategory.PERFORMANCE,
      properties: {
        sessionId: this.sessionId,
        timestamp: Date.now(),
      },
    })
  }

  /**
   * Enable or disable analytics tracking
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  /**
   * Set the current user ID for tracking
   */
  public setUserId(userId: string | null): void {
    this.userId = userId

    // Track user login/logout
    if (userId) {
      this.trackEvent({
        eventName: 'user_login',
        category: EventCategory.USER_ACTION,
      })
    } else {
      this.trackEvent({
        eventName: 'user_logout',
        category: EventCategory.USER_ACTION,
      })
    }
  }

  /**
   * Set user properties for segmentation
   */
  public setUserProperties(properties: UserProperties): void {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
    }

    if (this.isEnabled) {
      // In a real app, this would send to your analytics service
      console.log('[Analytics] Setting user properties:', properties)
    }
  }

  /**
   * Track a screen view
   */
  public trackScreenView({
    screenName,
    screenClass,
    previousScreen,
    properties,
  }: ScreenViewParams): void {
    if (!this.isEnabled) return

    Performance.logExecutionTime(`screen_view_${screenName}`, 0, true)

    const screenViewProps: EventProperties = {
      screen_name: screenName,
      screen_class: screenClass,
      previous_screen: previousScreen || this.lastScreenName,
      session_id: this.sessionId,
      ...properties,
    }

    // Save for future tracking
    this.lastScreenName = screenName

    // In a real app, this would send to your analytics service
    console.log('[Analytics] Screen view:', screenViewProps)
  }

  /**
   * Track a user event
   */
  public trackEvent({eventName, category, properties}: EventParams): void {
    if (!this.isEnabled) return

    const eventProps: EventProperties = {
      event_category: category,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      ...properties,
    }

    // In a real app, this would send to your analytics service
    console.log(`[Analytics] Event (${category}): ${eventName}`, eventProps)
  }

  /**
   * Track an error
   */
  public trackError({errorName, errorMessage, componentStack, properties}: ErrorParams): void {
    if (!this.isEnabled) return

    const errorProps: EventProperties = {
      error_name: errorName,
      error_message: errorMessage,
      component_stack: componentStack,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      ...properties,
    }

    // In a real app, this would send to your analytics service
    console.error('[Analytics] Error:', errorProps)
  }

  /**
   * Track a custom metric (numberic value)
   */
  public trackMetric(metricName: string, value: number, properties?: EventProperties): void {
    if (!this.isEnabled) return

    const metricProps: EventProperties = {
      metric_name: metricName,
      metric_value: value,
      session_id: this.sessionId,
      user_id: this.userId,
      timestamp: Date.now(),
      ...properties,
    }

    // In a real app, this would send to your analytics service
    console.log('[Analytics] Metric:', metricProps)
  }

  /**
   * Track app cold start time
   */
  public trackAppStartTime(startTimeMs: number): void {
    this.trackMetric('app_start_time', startTimeMs, {
      category: EventCategory.PERFORMANCE,
    })
  }

  /**
   * Track time to interactive (TTI)
   */
  public trackTimeToInteractive(timeMs: number): void {
    this.trackMetric('time_to_interactive', timeMs, {
      category: EventCategory.PERFORMANCE,
    })
  }

  /**
   * Track a conversion event (job application, account creation, etc.)
   */
  public trackConversion(conversionName: string, properties?: EventProperties): void {
    this.trackEvent({
      eventName: conversionName,
      category: EventCategory.CONVERSION,
      properties,
    })
  }

  /**
   * Track a search query
   */
  public trackSearch(query: string, resultsCount: number, properties?: EventProperties): void {
    this.trackEvent({
      eventName: 'search',
      category: EventCategory.USER_ACTION,
      properties: {
        search_query: query,
        results_count: resultsCount,
        ...properties,
      },
    })
  }

  /**
   * Track a job view
   */
  public trackJobView(jobId: string, jobTitle: string, companyName: string): void {
    this.trackEvent({
      eventName: 'job_view',
      category: EventCategory.ENGAGEMENT,
      properties: {
        job_id: jobId,
        job_title: jobTitle,
        company_name: companyName,
      },
    })
  }

  /**
   * Track a job application
   */
  public trackJobApplication(jobId: string, jobTitle: string, companyName: string): void {
    this.trackConversion('job_application', {
      job_id: jobId,
      job_title: jobTitle,
      company_name: companyName,
    })
  }

  /**
   * Track when a company posts a new job
   */
  public trackJobPosting(jobId: string, jobTitle: string): void {
    this.trackConversion('job_posting', {
      job_id: jobId,
      job_title: jobTitle,
    })
  }
}

// Create and export a singleton instance
const analytics = new AnalyticsService()
export default analytics
