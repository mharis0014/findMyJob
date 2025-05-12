/**
 * Performance monitoring and analytics utility
 *
 * This module provides a set of tools for:
 * - Measuring function execution time
 * - Tracking operation success/failure
 * - Capturing usage metrics
 *
 * In a production app, this would be connected to
 * services like Firebase Performance Monitoring,
 * Crashlytics, or other analytics tools.
 */

// Simple polyfill for performance measurement in React Native
const now = (): number => {
  try {
    // Use Date.now as a reliable fallback
    return Date.now()
  } catch {
    return 0
  }
}

// Map to store execution times
const executionTimes = new Map<string, number[]>()

// Interfaces
interface OperationMetrics {
  operation: string
  success: boolean
  duration: number
  timestamp: number
  metadata?: Record<string, unknown>
}

// Store metrics history
const metricsHistory: OperationMetrics[] = []

/**
 * Decorator for measuring function execution time
 *
 * @param target Class instance
 * @param propertyKey Method name
 * @param descriptor Method descriptor
 * @returns Modified descriptor that measures execution time
 */
export function measure(
  target: unknown,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = async function (...args: unknown[]): Promise<unknown> {
    const start = now()
    try {
      // Execute the original method
      const result = await originalMethod.apply(this, args)
      const end = now()
      logExecutionTime(propertyKey, end - start)

      return result
    } catch (error) {
      const end = now()
      logExecutionTime(propertyKey, end - start, false)
      throw error
    }
  }

  return descriptor
}

/**
 * Tracks the execution time of a function
 *
 * @param name Function name or identifier
 * @param time Execution time in milliseconds
 * @param success Whether the operation was successful
 */
export function logExecutionTime(name: string, time: number, success = true): void {
  if (!executionTimes.has(name)) {
    executionTimes.set(name, [])
  }

  executionTimes.get(name)?.push(time)

  // Record this operation in history
  metricsHistory.push({
    operation: name,
    success,
    duration: time,
    timestamp: Date.now(),
  })

  // Log for development - React Native will strip these in production builds
  console.log(`[Performance] ${name} took ${time.toFixed(2)}ms`)
}

/**
 * Measures the execution time of an async function
 *
 * @param fn The function to measure
 * @param name An identifier for the function
 * @param metadata Additional data to record
 * @returns The result of the function
 */
export async function measureAsync<T>(
  fn: () => Promise<T>,
  name: string,
  metadata?: Record<string, unknown>,
): Promise<T> {
  const start = now()
  try {
    const result = await fn()
    const end = now()

    metricsHistory.push({
      operation: name,
      success: true,
      duration: end - start,
      timestamp: Date.now(),
      metadata,
    })

    console.log(`[Performance] ${name} took ${(end - start).toFixed(2)}ms`)

    return result
  } catch (error) {
    const end = now()

    metricsHistory.push({
      operation: name,
      success: false,
      duration: end - start,
      timestamp: Date.now(),
      metadata: {
        ...metadata,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    })

    console.log(`[Performance] ${name} failed after ${(end - start).toFixed(2)}ms`)

    throw error
  }
}

/**
 * Gets the average execution time for a function
 *
 * @param name Function name or identifier
 * @returns Average execution time in milliseconds
 */
export function getAverageExecutionTime(name: string): number | null {
  const times = executionTimes.get(name)
  if (!times || times.length === 0) {
    return null
  }

  const sum = times.reduce((acc, time) => acc + time, 0)
  return sum / times.length
}

/**
 * Gets metrics for a specific operation
 *
 * @param operationName Name of the operation to filter by
 * @returns Array of operation metrics
 */
export function getOperationMetrics(operationName: string): OperationMetrics[] {
  return metricsHistory.filter(metric => metric.operation === operationName)
}

/**
 * Gets the success rate for an operation
 *
 * @param operationName Name of the operation
 * @returns Success rate as a number between 0 and 1
 */
export function getSuccessRate(operationName: string): number | null {
  const metrics = getOperationMetrics(operationName)
  if (metrics.length === 0) {
    return null
  }

  const successCount = metrics.filter(metric => metric.success).length
  return successCount / metrics.length
}

/**
 * Reports all accumulated metrics
 * Placeholder for sending data to a backend
 */
export function reportMetrics(): void {
  console.log('[Performance] Reporting metrics:', {
    operationCounts: getOperationCounts(),
    averageExecutionTimes: getAverageExecutionTimes(),
  })

  // In a real app, we would send this data to a backend service
  // api.send('/metrics', { metrics: metricsHistory });
}

/**
 * Gets counts of all operations
 */
function getOperationCounts(): Record<string, number> {
  const counts: Record<string, number> = {}

  metricsHistory.forEach(metric => {
    if (!counts[metric.operation]) {
      counts[metric.operation] = 0
    }
    counts[metric.operation]++
  })

  return counts
}

/**
 * Gets average execution times for all operations
 */
function getAverageExecutionTimes(): Record<string, number> {
  const operations = new Set(metricsHistory.map(m => m.operation))
  const result: Record<string, number> = {}

  operations.forEach(op => {
    const avg = getAverageExecutionTime(op)
    if (avg !== null) {
      result[op] = avg
    }
  })

  return result
}

export default {
  measure,
  measureAsync,
  logExecutionTime,
  getAverageExecutionTime,
  getOperationMetrics,
  getSuccessRate,
  reportMetrics,
}
