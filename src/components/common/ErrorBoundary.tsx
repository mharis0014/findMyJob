import React, {Component, ErrorInfo, ReactNode} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'

import {colors} from '../../constants/colors'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child component tree,
 * displays a fallback UI, and provides a way to recover.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render(): ReactNode {
    const {hasError, error} = this.state
    const {children, fallback} = this.props

    if (hasError) {
      if (fallback) {
        return fallback
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong</Text>
          {error && <Text style={styles.message}>{error.message}</Text>}
          <TouchableOpacity style={styles.button} onPress={this.resetError}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
})

export default ErrorBoundary
