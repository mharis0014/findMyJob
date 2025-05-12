declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import {Component} from 'react'
  import {TextStyle, ViewStyle} from 'react-native'

  export interface IconProps {
    name: string
    size?: number
    color?: string
    style?: TextStyle | ViewStyle
  }

  export default class Icon extends Component<IconProps> {
    static getImageSource(name: string, size?: number, color?: string): Promise<{uri: string}>
    static loadFont(file?: string): Promise<void>
    static hasIcon(name: string): boolean
  }
}
