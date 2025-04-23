import React from 'react'
import {NavigationContainer} from '@react-navigation/native'

import Toast from 'react-native-toast-message'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

import MainNavigator from './src/navigation/MainNavigator'

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <MainNavigator />
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App
