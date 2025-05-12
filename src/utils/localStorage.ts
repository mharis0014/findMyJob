import {MMKV} from 'react-native-mmkv'

const storage = new MMKV()

// Default cache expiration in milliseconds (30 minutes)
const DEFAULT_CACHE_EXPIRATION = 30 * 60 * 1000

// Type for cached item with expiration
interface CachedItem<T> {
  value: T
  expiry: number
}

class LocalStorage {
  /**
   * Creates a namespaced key to avoid collision
   */
  private static getNamespacedKey(namespace: string, key: string): string {
    return `${namespace}:${key}`
  }

  /**
   * Set an item in local storage
   */
  static setItem(key: string, value: string): void {
    try {
      storage.set(key, value)
    } catch (error) {
      console.error('Error saving data to MMKV:', error)
    }
  }

  /**
   * Set an item with a namespace for better organization
   */
  static setNamespacedItem(namespace: string, key: string, value: string): void {
    this.setItem(this.getNamespacedKey(namespace, key), value)
  }

  /**
   * Set multiple items at once
   */
  static setItems(items: Record<string, string>): void {
    try {
      Object.entries(items).forEach(([key, value]) => {
        storage.set(key, value)
      })
    } catch (error) {
      console.error('Error saving multiple items to MMKV:', error)
    }
  }

  /**
   * Set an item with expiration
   */
  static setCachedItem<T>(key: string, value: T, expirationMs = DEFAULT_CACHE_EXPIRATION): void {
    try {
      const item: CachedItem<T> = {
        value,
        expiry: Date.now() + expirationMs,
      }
      storage.set(key, JSON.stringify(item))
    } catch (error) {
      console.error('Error caching data to MMKV:', error)
    }
  }

  /**
   * Set a namespaced cached item
   */
  static setCachedNamespacedItem<T>(
    namespace: string,
    key: string,
    value: T,
    expirationMs = DEFAULT_CACHE_EXPIRATION,
  ): void {
    this.setCachedItem(this.getNamespacedKey(namespace, key), value, expirationMs)
  }

  /**
   * Get an item from local storage
   */
  static getItem(key: string): string | null {
    try {
      const value = storage.getString(key)
      return value === undefined ? null : value
    } catch (error) {
      console.error('Error retrieving data from MMKV:', error)
      return null
    }
  }

  /**
   * Get a namespaced item
   */
  static getNamespacedItem(namespace: string, key: string): string | null {
    return this.getItem(this.getNamespacedKey(namespace, key))
  }

  /**
   * Get multiple items at once
   */
  static getItems(keys: string[]): Record<string, string | null> {
    const result: Record<string, string | null> = {}

    try {
      keys.forEach(key => {
        result[key] = this.getItem(key)
      })
    } catch (error) {
      console.error('Error retrieving multiple items from MMKV:', error)
    }

    return result
  }

  /**
   * Get a cached item with expiry check
   */
  static getCachedItem<T>(key: string): T | null {
    try {
      const value = storage.getString(key)
      if (!value) return null

      const item = JSON.parse(value) as CachedItem<T>

      // Check if the item has expired
      if (item.expiry && item.expiry < Date.now()) {
        this.removeItem(key)
        return null
      }

      return item.value
    } catch (error) {
      console.error('Error retrieving cached data from MMKV:', error)
      return null
    }
  }

  /**
   * Get a namespaced cached item
   */
  static getCachedNamespacedItem<T>(namespace: string, key: string): T | null {
    return this.getCachedItem<T>(this.getNamespacedKey(namespace, key))
  }

  /**
   * Check if a cached item has expired
   */
  static hasCacheExpired(key: string): boolean {
    try {
      const value = storage.getString(key)
      if (!value) return true

      const item = JSON.parse(value) as {expiry?: number}
      return item.expiry ? item.expiry < Date.now() : true
    } catch {
      return true
    }
  }

  /**
   * Check if a namespaced cached item has expired
   */
  static hasNamespacedCacheExpired(namespace: string, key: string): boolean {
    return this.hasCacheExpired(this.getNamespacedKey(namespace, key))
  }

  /**
   * Remove an item from local storage
   */
  static removeItem(key: string): void {
    try {
      storage.delete(key)
    } catch (error) {
      console.error('Error removing data from MMKV:', error)
    }
  }

  /**
   * Remove a namespaced item
   */
  static removeNamespacedItem(namespace: string, key: string): void {
    this.removeItem(this.getNamespacedKey(namespace, key))
  }

  /**
   * Remove multiple items at once
   */
  static removeItems(keys: string[]): void {
    try {
      keys.forEach(key => {
        storage.delete(key)
      })
    } catch (error) {
      console.error('Error removing multiple items from MMKV:', error)
    }
  }

  /**
   * Remove all items within a namespace
   */
  static clearNamespace(namespace: string): void {
    try {
      const allKeys = storage.getAllKeys()
      const namespacePrefix = `${namespace}:`

      allKeys.filter(key => key.startsWith(namespacePrefix)).forEach(key => storage.delete(key))
    } catch (error) {
      console.error(`Error clearing namespace ${namespace}:`, error)
    }
  }

  /**
   * Clear all data from local storage
   */
  static clear(): void {
    try {
      storage.clearAll()
    } catch (error) {
      console.error('Error clearing MMKV store:', error)
    }
  }
}

export default LocalStorage
