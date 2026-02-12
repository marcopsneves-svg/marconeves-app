import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
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
import { createBuyer } from '../src/utils/api';

const PROPERTY_TYPES = [
  { label: 'Apartamento', value: 'Apartamento' },
  { label: 'Moradia', value: 'Moradia' },
  { label: 'Terreno', value: 'Terreno' },
  { label: 'Outro', value: 'Outro' },
];

const TIMELINES = [
  { label: 'Imediato', value: 'Imediato' },
  { label: '3 meses', value: '3 meses' },
  { label: '6+ meses', value: '6+ meses' },
];

export default function BuyScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [financingNeeded, setFinancingNeeded] = useState(false);
  const [timeline, setTimeline] = useState('');
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
    if (!budget.trim()) newErrors.budget = 'Orçamento é obrigatório';
    if (!location.trim()) newErrors.location = 'Localização preferida é obrigatória';
    if (!timeline) newErrors.timeline = 'Prazo é obrigatório';
    if (!gdprConsent) newErrors.gdpr = 'Deve aceitar a política de privacidade';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const { data, error } = await createBuyer({
      name,
      phone,
      email,
      budget,
      location,
      property_type: propertyType || null,
      financing_needed: financingNeeded,
      timeline,
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
      setBudget('');
      setLocation('');
      setPropertyType('');
      setFinancingNeeded(false);
      setTimeline('');
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
            title="Comprar Imóvel"
            subtitle="Conte-nos o que procura e encontraremos o imóvel ideal para si."
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

            <FormInput
              label="Orçamento Disponível"
              value={budget}
              onChangeText={setBudget}
              placeholder="Ex: €150.000 - €250.000"
              required
              error={errors.budget}
            />

            <FormInput
              label="Localização Preferida"
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
              placeholder="Selecionar tipo (opcional)"
            />

            <View style={styles.financingContainer}>
              <Text style={styles.label}>Precisa de Financiamento?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    financingNeeded && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFinancingNeeded(true)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      financingNeeded && styles.toggleTextActive,
                    ]}
                  >
                    Sim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !financingNeeded && styles.toggleButtonActive,
                  ]}
                  onPress={() => setFinancingNeeded(false)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !financingNeeded && styles.toggleTextActive,
                    ]}
                  >
                    Não
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <PickerSelect
              label="Prazo para Compra"
              value={timeline}
              options={TIMELINES}
              onChange={setTimeline}
              placeholder="Selecionar prazo..."
              required
              error={errors.timeline}
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
              title="Encontrar o Meu Imóvel"
              onPress={handleSubmit}
              loading={loading}
            />

            <WhatsAppButton
              message="Olá Marco, estou à procura de um imóvel para comprar."
              title="Contactar via WhatsApp"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        title="Pedido Enviado!"
        message="Obrigado pelo seu interesse. Marco Neves entrará em contacto consigo brevemente com imóveis adequados ao seu perfil."
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
  financingContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  toggleText: {
    fontSize: 16,
    color: COLORS.text,
  },
  toggleTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  submitError: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
