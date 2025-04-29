import {useState} from 'react'
import {useNavigation} from '@react-navigation/native'

import {NativeStackNavigationProp} from '@react-navigation/native-stack'

import {CompanyBottomTabsParamList} from '../constants/types'
import LocalStorage from '../utils/localStorage'

type NavigationProp = NativeStackNavigationProp<CompanyBottomTabsParamList>

export const useLogout = () => {
  const [isLogoutAlertVisible, setIsLogoutAlertVisible] = useState(false)
  const navigation = useNavigation<NavigationProp>()

  const showLogoutAlert = () => setIsLogoutAlertVisible(true)
  const hideLogoutAlert = () => setIsLogoutAlertVisible(false)

  const handleConfirmLogout = async () => {
    await LocalStorage.clear()
    setIsLogoutAlertVisible(false)
    navigation.getParent()?.navigate('RootNavigator')
  }

  return {
    isLogoutAlertVisible,
    showLogoutAlert,
    hideLogoutAlert,
    handleConfirmLogout,
  }
}
