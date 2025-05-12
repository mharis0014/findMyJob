#!/usr/bin/env node

/**
 * Project Restructuring Script
 *
 * This script helps reorganize your project according to
 * the new professional folder structure.
 *
 * Usage: node scripts/restructure.js
 */

const fs = require('fs')
const path = require('path')
const {execSync} = require('child_process')

// Root directory
const ROOT_DIR = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src')

// Create new directories if they don't exist
const directories = [
  'src/features',
  'src/features/auth/components',
  'src/features/auth/hooks',
  'src/features/auth/screens',
  'src/features/auth/services',
  'src/features/auth/utils',
  'src/features/job-search/components',
  'src/features/job-search/hooks',
  'src/features/job-search/screens',
  'src/features/job-search/services',
  'src/features/applications/components',
  'src/features/applications/hooks',
  'src/features/applications/screens',
  'src/features/profile/components',
  'src/features/profile/hooks',
  'src/features/profile/screens',
  'src/components/common/Button',
  'src/components/common/Card',
  'src/components/common/Input',
  'src/components/common/Animated',
  'src/components/layout',
  'src/context',
  'src/store',
  'src/store/slices',
  'src/store/selectors',
  'src/assets/icons',
  'src/assets/images',
  'src/assets/animations',
]

// Create directories
console.log('Creating directory structure...')
directories.forEach(dir => {
  const fullPath = path.join(ROOT_DIR, dir)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, {recursive: true})
    console.log(`Created: ${dir}`)
  } else {
    console.log(`Already exists: ${dir}`)
  }
})

// Move files according to their category
// (This is a simplified example - customize based on your actual files)
const fileMappings = [
  // Auth related files
  {from: 'src/screens/LoginScreen.tsx', to: 'src/features/auth/screens/LoginScreen.tsx'},
  {from: 'src/screens/RegisterScreen.tsx', to: 'src/features/auth/screens/RegisterScreen.tsx'},
  {from: 'src/hooks/useAuth.ts', to: 'src/features/auth/hooks/useAuth.ts'},

  // Job search related files
  {
    from: 'src/screens/JobSearchScreen.tsx',
    to: 'src/features/job-search/screens/JobSearchScreen.tsx',
  },
  {from: 'src/hooks/useJobs.ts', to: 'src/features/job-search/hooks/useJobs.ts'},
  {from: 'src/hooks/useJobFilters.ts', to: 'src/features/job-search/hooks/useJobFilters.ts'},

  // Application related files
  {
    from: 'src/screens/JobApplicationTrackerScreen.tsx',
    to: 'src/features/applications/screens/ApplicationsScreen.tsx',
  },
  {from: 'src/hooks/useApplications.ts', to: 'src/features/applications/hooks/useApplications.ts'},
  {
    from: 'src/components/application/AddJobApplication.tsx',
    to: 'src/features/applications/components/AddJobApplication.tsx',
  },

  // Common components
  {from: 'src/components/Button.tsx', to: 'src/components/common/Button/index.tsx'},
  {from: 'src/components/Card.tsx', to: 'src/components/common/Card/index.tsx'},
]

// Move files
console.log('\nMoving files to new structure...')
fileMappings.forEach(mapping => {
  const fromPath = path.join(ROOT_DIR, mapping.from)
  const toPath = path.join(ROOT_DIR, mapping.to)

  // Only try to move if source file exists
  if (fs.existsSync(fromPath)) {
    // Create target directory if it doesn't exist
    const targetDir = path.dirname(toPath)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, {recursive: true})
    }

    // Move file
    try {
      fs.copyFileSync(fromPath, toPath)
      console.log(`Moved: ${mapping.from} -> ${mapping.to}`)
    } catch (err) {
      console.error(`Error moving ${mapping.from}: ${err.message}`)
    }
  } else {
    console.log(`Source file not found: ${mapping.from}`)
  }
})

// Create basic template files for new structure
console.log('\nCreating template files...')

// Create navigators
const navigationTemplates = [
  {
    path: 'src/navigation/AppNavigator.tsx',
    content: `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { useAuth } from '../features/auth/hooks/useAuth';
import SplashScreen from '../screens/SplashScreen';
import { linking } from './linking';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="Main" component={MainNavigator} />
          ) : (
            <Stack.Screen name="Auth" component={AuthNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
`,
  },
  {
    path: 'src/navigation/types.ts',
    content: `import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Verification: { email: string };
};

export type MainStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
  JobDetail: { jobId: string };
  CompanyDetail: { companyId: string };
  ApplicationForm: { jobId: string };
  Chat: { chatId: string; recipientName: string };
  NotificationSettings: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  JobSearch: undefined;
  Applications: undefined;
  Profile: undefined;
};
`,
  },
]

// Create animation components
const animationTemplates = [
  {
    path: 'src/components/common/Animated/FadeIn.tsx',
    content: `import React from 'react';
import Animated, { FadeIn as ReanimatedFadeIn } from 'react-native-reanimated';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({ 
  children, 
  delay = 300, 
  duration = 500 
}) => {
  return (
    <Animated.View 
      entering={ReanimatedFadeIn.delay(delay).duration(duration)}
    >
      {children}
    </Animated.View>
  );
};

export default FadeIn;
`,
  },
  {
    path: 'src/components/common/Animated/ScaleFade.tsx',
    content: `import React from 'react';
import Animated, { 
  FadeIn, 
  FadeOut,
  SlideInRight,
  SlideOutLeft 
} from 'react-native-reanimated';

interface ScaleFadeProps {
  children: React.ReactNode;
  visible: boolean;
}

export const ScaleFade: React.FC<ScaleFadeProps> = ({ children, visible }) => {
  if (!visible) return null;
  
  return (
    <Animated.View 
      entering={FadeIn.springify().mass(0.8)}
      exiting={FadeOut}
    >
      {children}
    </Animated.View>
  );
};

export default ScaleFade;
`,
  },
]

// Create context files
const contextTemplates = [
  {
    path: 'src/context/ThemeContext.tsx',
    content: `import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '../config/theme';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  colors: typeof COLORS.light;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');
  
  const isDarkMode = theme === 'system' 
    ? colorScheme === 'dark'
    : theme === 'dark';
  
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
`,
  },
]

// Config files
const configTemplates = [
  {
    path: 'src/config/theme.ts',
    content: `/**
 * Application theme configuration
 */

export const COLORS = {
  light: {
    primary: '#1A8CFF',
    secondary: '#6C63FF',
    accent: '#FF6584',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#333333',
    border: '#EEEEEE',
    notification: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  dark: {
    primary: '#0A84FF',
    secondary: '#8E8AFF',
    accent: '#FF6584',
    background: '#121212',
    card: '#1E1E1E',
    text: '#F2F2F7',
    border: '#2C2C2E',
    notification: '#FF453A',
    success: '#30D158',
    warning: '#FFD60A',
    error: '#FF453A',
  },
};

export const FONTS = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SHADOWS = {
  light: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  dark: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 4,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 9,
    },
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};
`,
  },
]

// Write template files
const allTemplates = [
  ...navigationTemplates,
  ...animationTemplates,
  ...contextTemplates,
  ...configTemplates,
]

allTemplates.forEach(template => {
  const filePath = path.join(ROOT_DIR, template.path)
  const dirPath = path.dirname(filePath)

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, {recursive: true})
  }

  // Write file if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, template.content)
    console.log(`Created: ${template.path}`)
  } else {
    console.log(`File already exists: ${template.path}`)
  }
})

// Create component index files
const componentIndexFiles = [
  'src/components/common/Button/index.tsx',
  'src/components/common/Card/index.tsx',
  'src/components/common/Input/index.tsx',
]

// Add package.json scripts
console.log('\nUpdating package.json with new scripts...')
try {
  const packageJsonPath = path.join(ROOT_DIR, 'package.json')
  const packageJson = require(packageJsonPath)

  packageJson.scripts = {
    ...packageJson.scripts,
    'analyze-bundle': 'react-native-bundle-analyzer',
    'lint:ts': 'eslint "src/**/*.{ts,tsx}"',
    'lint:fix': 'eslint "src/**/*.{ts,tsx}" --fix',
    'type-check': 'tsc --noEmit',
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
  console.log('Updated package.json')
} catch (err) {
  console.error('Error updating package.json:', err.message)
}

console.log(
  '\nRestructuring complete. Please review the changes and move files manually as needed.',
)
console.log('You may need to install additional packages for animations and navigation:')
console.log(
  'yarn add react-native-reanimated react-native-gesture-handler @react-navigation/shared-element lottie-react-native',
)
console.log('yarn add --dev react-native-bundle-analyzer')

// Instructions for next steps
console.log('\nNext steps:')
console.log('1. Review the generated file structure')
console.log(
  '2. Move existing components to the new structure according to the feature-based organization',
)
console.log('3. Update imports in your files to match the new structure')
console.log('4. Test the app thoroughly after restructuring')
