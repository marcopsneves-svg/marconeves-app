import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';

export default function PartnerLogos() {
  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <View style={styles.remaxLogo}>
          <Text style={styles.remaxRe}>RE</Text>
          <Text style={styles.remaxSlash}>/</Text>
          <Text style={styles.remaxMax}>MAX</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.logoWrapper}>
        <View style={styles.grupoVantagemLogo}>
          <Text style={styles.grupoText}>GRUPO</Text>
          <Text style={styles.vantagemText}>VANTAGEM</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
  },
  logoWrapper: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  remaxLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  remaxRe: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003DA5',
    letterSpacing: 1,
  },
  remaxSlash: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC1E35',
    marginHorizontal: 1,
  },
  remaxMax: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC1E35',
    letterSpacing: 1,
  },
  grupoVantagemLogo: {
    alignItems: 'center',
  },
  grupoText: {
    fontSize: 8,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 2,
  },
  vantagemText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
});
