import React from 'react';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WHATSAPP_NUMBER, COLORS } from '../constants/theme';
import PrimaryButton from './PrimaryButton';

interface WhatsAppButtonProps {
  message: string;
  title?: string;
}

export default function WhatsAppButton({ message, title = 'WhatsApp' }: WhatsAppButtonProps) {
  const handlePress = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    Linking.openURL(url);
  };

  return (
    <PrimaryButton
      title={title}
      onPress={handlePress}
      variant="whatsapp"
      icon={<Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />}
    />
  );
}
