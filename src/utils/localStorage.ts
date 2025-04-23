import {MMKV} from 'react-native-mmkv'

const storage = new MMKV()

class LocalStorage {
  // Set an item in local storage
  static setItem(key: string, value: string): void {
    try {
      storage.set(key, value)
    } catch (error) {
      console.error('Error saving data to MMKV:', error)
    }
  }

  // Get an item from local storage
  static getItem(key: string): string | null {
    try {
      const value = storage.getString(key)
      return value === undefined ? null : value
    } catch (error) {
      console.error('Error retrieving data from MMKV:', error)
      return null
    }
  }

  // Remove an item from local storage
  static removeItem(key: string): void {
    try {
      storage.delete(key)
    } catch (error) {
      console.error('Error removing data from MMKV:', error)
    }
  }

  // Clear all data from local storage
  static clear(): void {
    try {
      storage.clearAll()
    } catch (error) {
      console.error('Error clearing MMKV store:', error)
    }
  }
}

export default LocalStorage
