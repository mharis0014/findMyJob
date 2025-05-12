import React from 'react';
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
