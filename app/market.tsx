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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import FormInput from '../src/components/FormInput';
import PrimaryButton from '../src/components/PrimaryButton';
import PickerSelect from '../src/components/PickerSelect';
import GDPRCheckbox from '../src/components/GDPRCheckbox';
import SuccessModal from '../src/components/SuccessModal';
import WhatsAppButton from '../src/components/WhatsAppButton';
import Header from '../src/components/Header';
import { createMarketStudy } from '../src/utils/api';

const PROPERTY_TYPES = [
  { label: 'Apartamento', value: 'Apartamento' },
  { label: 'Moradia', value: 'Moradia' },
  { label: 'Terreno', value: 'Terreno' },
  { label: 'Outro', value: 'Outro' },
];

export default function MarketScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertySize, setPropertySize] = useState('');
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
    if (!location.trim()) newErrors.location = 'Localização é obrigatória';
    if (!propertyType) newErrors.propertyType = 'Tipo de imóvel é obrigatório';
    if (!gdprConsent) newErrors.gdpr = 'Deve aceitar a política de privacidade';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const { data, error } = await createMarketStudy({
      name,
      phone,
      email,
      location,
      property_type: propertyType,
      property_size: propertySize || null,
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
      setLocation('');
      setPropertyType('');
      setPropertySize('');
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
            title="Estudo de Mercado Gratuito"
            subtitle="Receba uma análise comparativa de mercado profissional para conhecer o valor real do seu imóvel."
          />

          <View style={styles.infoCard}>
            <Ionicons name="stats-chart" size={28} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Análise Profissional</Text>
              <Text style={styles.infoText}>
                Estudo comparativo completo com análise de mercado e avaliação do seu imóvel.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
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
              label="Localização do Imóvel"
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Lisboa, Cascais, Porto..."
              required
              error={errors.location}
            />

            <PickerSelect
              label="Tipo de Imóvel"
              value={propertyType}
              options={PROPERTY_TYPES}
              onChange={setPropertyType}
              placeholder="Selecionar tipo..."
              required
              error={errors.propertyType}
            />

            <FormInput
              label="Área do Imóvel (m²)"
              value={propertySize}
              onChangeText={setPropertySize}
              placeholder="Ex: 85 (opcional)"
              keyboardType="numeric"
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
              title="Solicitar Estudo de Mercado"
              onPress={handleSubmit}
              loading={loading}
            />

            <WhatsAppButton
              message="Olá Marco, gostaria de solicitar um estudo de mercado para o meu imóvel."
              title="Contactar via WhatsApp"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        title="Pedido Enviado!"
        message="Obrigado pelo seu pedido. Marco Neves entrará em contacto consigo para realizar o estudo de mercado do seu imóvel."
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoContent: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
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
  submitError: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
