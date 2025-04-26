import React from 'react'
import {NavigationContainer} from '@react-navigation/native'

import Toast from 'react-native-toast-message'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

import RootNavigator from './src/navigation/RootNavigator'

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <RootNavigator />
        <Toast />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App
