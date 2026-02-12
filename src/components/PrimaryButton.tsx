import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'outline';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  style,
}: PrimaryButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'secondary':
        return COLORS.primary;
      case 'whatsapp':
        return COLORS.whatsapp;
      case 'outline':
        return 'transparent';
      default:
        return COLORS.accent;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return COLORS.primary;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outline,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor() }, icon && styles.textWithIcon]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginVertical: SPACING.xs,
  },
  outline: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  textWithIcon: {
    marginLeft: SPACING.sm,
  },
});
