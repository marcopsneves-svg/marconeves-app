import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface GDPRCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  error?: string;
}

export default function GDPRCheckbox({ checked, onToggle, error }: GDPRCheckboxProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkboxRow} onPress={onToggle} activeOpacity={0.7}>
        <View style={[styles.checkbox, checked && styles.checked, error && styles.checkboxError]}>
          {checked && <Ionicons name="checkmark" size={18} color={COLORS.white} />}
        </View>
        <Text style={styles.text}>
          Consinto com o tratamento dos meus dados pessoais de acordo com a política de privacidade e RGPD.
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 2,
  },
  checked: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  checkboxError: {
    borderColor: COLORS.error,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: SPACING.xs,
    marginLeft: 32,
  },
});
