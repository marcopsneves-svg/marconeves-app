import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

interface AnimatedScreenProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedScreen({ children, delay = 0 }: AnimatedScreenProps) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(400)}
      style={styles.container}
    >
      {children}
    </Animated.View>
  );
}

export function AnimatedFormField({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(100 + index * 50).duration(400).springify()}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
