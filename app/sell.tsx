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
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import FormInput from '../src/components/FormInput';
import PrimaryButton from '../src/components/PrimaryButton';
import PickerSelect from '../src/components/PickerSelect';
import GDPRCheckbox from '../src/components/GDPRCheckbox';
import SuccessModal from '../src/components/SuccessModal';
import WhatsAppButton from '../src/components/WhatsAppButton';
import Header from '../src/components/Header';
import { createSeller } from '../src/utils/api';

const PROPERTY_TYPES = [
  { label: 'Apartamento', value: 'Apartamento' },
  { label: 'Moradia', value: 'Moradia' },
  { label: 'Terreno', value: 'Terreno' },
  { label: 'Outro', value: 'Outro' },
];

const URGENCY_LEVELS = [
  { label: 'Baixa', value: 'Baixa' },
  { label: 'Média', value: 'Média' },
  { label: 'Alta', value: 'Alta' },
];

export default function SellScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [urgency, setUrgency] = useState('');
  const [notes, setNotes] = useState('');
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
    if (!propertyType) newErrors.propertyType = 'Tipo de imóvel é obrigatório';
    if (!location.trim()) newErrors.location = 'Localização é obrigatória';
    if (!urgency) newErrors.urgency = 'Nível de urgência é obrigatório';
    if (!gdprConsent) newErrors.gdpr = 'Deve aceitar a política de privacidade';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const { data, error } = await createSeller({
      name,
      phone,
      email,
      property_type: propertyType,
      location,
      estimated_price: estimatedPrice || null,
      urgency,
      notes: notes || null,
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
      setPropertyType('');
      setLocation('');
      setEstimatedPrice('');
      setUrgency('');
      setNotes('');
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
            title="Vender o Meu Imóvel"
            subtitle="Peça uma avaliação gratuita do seu imóvel. Marco Neves irá contactá-lo para avaliar a sua propriedade."
          />

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
              label="Localização do Imóvel"
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Lisboa, Cascais, Porto..."
              required
              error={errors.location}
            />

            <FormInput
              label="Preço Estimado"
              value={estimatedPrice}
              onChangeText={setEstimatedPrice}
              placeholder="€ (opcional)"
              keyboardType="numeric"
            />

            <PickerSelect
              label="Nível de Urgência"
              value={urgency}
              options={URGENCY_LEVELS}
              onChange={setUrgency}
              placeholder="Selecionar urgência..."
              required
              error={errors.urgency}
            />

            <FormInput
              label="Notas Adicionais"
              value={notes}
              onChangeText={setNotes}
              placeholder="Informações adicionais sobre o imóvel (opcional)"
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
              title="Solicitar Avaliação"
              onPress={handleSubmit}
              loading={loading}
            />

            <WhatsAppButton
              message="Olá Marco, quero vender o meu imóvel."
              title="Contactar via WhatsApp"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        title="Pedido Enviado!"
        message="Obrigado. Marco Neves entrará em contacto consigo brevemente para avaliar o seu imóvel."
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
  submitError: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
