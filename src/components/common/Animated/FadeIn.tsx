import React from 'react';
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
