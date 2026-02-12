import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

const ADMIN_PIN_KEY = '@admin_pin';
const DEFAULT_PIN = '1234';

interface AdminAuthProps {
  onAuthenticated: () => void;
  visible: boolean;
}

export default function AdminAuth({ onAuthenticated, visible }: AdminAuthProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [storedPin, setStoredPin] = useState(DEFAULT_PIN);

  useEffect(() => {
    loadStoredPin();
  }, []);

  const loadStoredPin = async () => {
    try {
      const savedPin = await AsyncStorage.getItem(ADMIN_PIN_KEY);
      if (savedPin) {
        setStoredPin(savedPin);
      } else {
        await AsyncStorage.setItem(ADMIN_PIN_KEY, DEFAULT_PIN);
      }
    } catch (e) {
      console.error('Error loading PIN:', e);
    }
  };

  const handlePinChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 4) {
      setPin(numericText);
      setError('');
      
      if (numericText.length === 4) {
        if (numericText === storedPin) {
          setPin('');
          onAuthenticated();
        } else {
          setError('PIN incorreto');
          setPin('');
        }
      }
    }
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.pinDot,
            i < pin.length && styles.pinDotFilled,
            error && styles.pinDotError,
          ]}
        />
      );
    }
    return dots;
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-closed" size={50} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Área Restrita</Text>
          <Text style={styles.subtitle}>Introduza o PIN de acesso</Text>
          
          <View style={styles.pinContainer}>
            {renderPinDots()}
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <TextInput
            style={styles.hiddenInput}
            value={pin}
            onChangeText={handlePinChange}
            keyboardType="number-pad"
            maxLength={4}
            autoFocus
            secureTextEntry
          />
          
          <Text style={styles.hint}>PIN padrão: 1234</Text>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SPACING.lg,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginHorizontal: SPACING.sm,
    backgroundColor: 'transparent',
  },
  pinDotFilled: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pinDotError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
});
