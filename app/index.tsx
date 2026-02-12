import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import FormInput from '../src/components/FormInput';
import PrimaryButton from '../src/components/PrimaryButton';
import GDPRCheckbox from '../src/components/GDPRCheckbox';
import SuccessModal from '../src/components/SuccessModal';
import ContactButtons from '../src/components/ContactButtons';
import Header from '../src/components/Header';
import { createContact } from '../src/utils/api';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }
    if (!gdprConsent) newErrors.gdpr = 'Deve aceitar a política de privacidade';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const { data, error } = await createContact({
      name,
      phone,
      email,
      message,
      gdpr_consent: gdprConsent,
    });
    setLoading(false);

    if (error) {
      setErrors({ submit: error });
    } else {
      setShowSuccess(true);
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setGdprConsent(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Header
            title="Contacte-nos"
            subtitle="Entre em contacto connosco para qualquer questão sobre o mercado imobiliário."
          />

          <Animated.View 
            entering={FadeInDown.delay(300).duration(500).springify()}
            style={styles.form}
          >
            <FormInput
              label="Nome Completo"
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              required
              error={errors.name}
            />

            <FormInput
              label="Telefone"
              value={phone}
              onChangeText={setPhone}
              placeholder="+351 XXX XXX XXX"
              keyboardType="phone-pad"
              required
              error={errors.phone}
            />

            <FormInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
              error={errors.email}
            />

            <FormInput
              label="Mensagem"
              value={message}
              onChangeText={setMessage}
              placeholder="Escreva a sua mensagem..."
              multiline
              numberOfLines={4}
            />

            <GDPRCheckbox
              checked={gdprConsent}
              onToggle={() => setGdprConsent(!gdprConsent)}
              error={errors.gdpr}
            />

            {errors.submit && (
              <Text style={styles.submitError}>{errors.submit}</Text>
            )}

            <PrimaryButton
              title="Enviar Mensagem"
              onPress={handleSubmit}
              loading={loading}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou contacte diretamente</Text>
              <View style={styles.dividerLine} />
            </View>

            <ContactButtons whatsappMessage="Olá Marco, gostaria de entrar em contacto." />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        title="Mensagem Enviada!"
        message="Obrigado pelo seu contacto. Marco Neves entrará em contacto consigo brevemente."
        onClose={() => setShowSuccess(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: SPACING.md,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  submitError: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
