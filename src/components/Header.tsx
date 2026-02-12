import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING } from '../constants/theme';
import PartnerLogos from './PartnerLogos';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showPartners?: boolean;
}

export default function Header({ title, subtitle, showPartners = true }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Animated.View 
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.logoContainer}
      >
        <Image 
          source={require('../../assets/images/marco-neves-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.Text 
        entering={FadeInDown.delay(200).duration(500)}
        style={styles.title}
      >
        {title}
      </Animated.Text>
      {subtitle && (
        <Animated.Text 
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.subtitle}
        >
          {subtitle}
        </Animated.Text>
      )}
      {showPartners && (
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <PartnerLogos />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.primary,
    marginHorizontal: -SPACING.md,
    marginTop: -SPACING.md,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  logoContainer: {
    marginBottom: SPACING.md,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    lineHeight: 20,
  },
});
