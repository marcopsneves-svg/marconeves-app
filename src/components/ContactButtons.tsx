import React from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { PHONE, EMAIL, COLORS, SPACING } from '../constants/theme';
import PrimaryButton from './PrimaryButton';
import WhatsAppButton from './WhatsAppButton';

interface ContactButtonsProps {
  whatsappMessage: string;
}

export default function ContactButtons({ whatsappMessage }: ContactButtonsProps) {
  const handleCall = () => {
    Linking.openURL(`tel:${PHONE}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${EMAIL}`);
  };

  return (
    <View style={styles.container}>
      <WhatsAppButton message={whatsappMessage} title="Contactar WhatsApp" />
      <PrimaryButton
        title="Ligar"
        onPress={handleCall}
        variant="secondary"
        icon={<Ionicons name="call" size={20} color={COLORS.white} />}
      />
      <PrimaryButton
        title="Enviar Email"
        onPress={handleEmail}
        variant="outline"
        icon={<MaterialIcons name="email" size={20} color={COLORS.primary} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.sm,
  },
});
