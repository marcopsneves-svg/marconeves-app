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
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import FormInput from '../src/components/FormInput';
import PrimaryButton from '../src/components/PrimaryButton';
import GDPRCheckbox from '../src/components/GDPRCheckbox';
import SuccessModal from '../src/components/SuccessModal';
import WhatsAppButton from '../src/components/WhatsAppButton';
import Header from '../src/components/Header';
import { createFinancial } from '../src/utils/api';

export default function FinancialScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [existingLoans, setExistingLoans] = useState(false);
  const [estimatedBudget, setEstimatedBudget] = useState('');
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
    if (!employmentStatus.trim()) newErrors.employmentStatus = 'Situação profissional é obrigatória';
    if (!monthlyIncome.trim()) newErrors.monthlyIncome = 'Rendimento mensal é obrigatório';
    if (!estimatedBudget.trim()) newErrors.estimatedBudget = 'Orçamento estimado é obrigatório';
    if (!gdprConsent) newErrors.gdpr = 'Deve aceitar a política de privacidade';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const { data, error } = await createFinancial({
      name,
      phone,
      email,
      employment_status: employmentStatus,
      monthly_income: monthlyIncome,
      existing_loans: existingLoans,
      estimated_budget: estimatedBudget,
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
      setEmploymentStatus('');
      setMonthlyIncome('');
      setExistingLoans(false);
      setEstimatedBudget('');
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
            title="Viabilidade Financeira"
            subtitle="Descubra a sua capacidade de financiamento antes de procurar imóvel."
          />

          <View style={styles.infoCard}>
            <FontAwesome5 name="calculator" size={24} color={COLORS.accent} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Análise de Viabilidade</Text>
              <Text style={styles.infoText}>
                Avaliamos a sua situação financeira para determinar o valor máximo de financiamento que pode obter.
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
              label="Situação Profissional"
              value={employmentStatus}
              onChangeText={setEmploymentStatus}
              placeholder="Ex: Trabalhador por conta de outrem, Empresário..."
              required
              error={errors.employmentStatus}
            />

            <FormInput
              label="Rendimento Mensal Líquido"
              value={monthlyIncome}
              onChangeText={setMonthlyIncome}
              placeholder="€"
              keyboardType="numeric"
              required
              error={errors.monthlyIncome}
            />

            <View style={styles.loansContainer}>
              <Text style={styles.label}>Tem Créditos em Curso?</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    existingLoans && styles.toggleButtonActive,
                  ]}
                  onPress={() => setExistingLoans(true)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      existingLoans && styles.toggleTextActive,
                    ]}
                  >
                    Sim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    !existingLoans && styles.toggleButtonActive,
                  ]}
                  onPress={() => setExistingLoans(false)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      !existingLoans && styles.toggleTextActive,
                    ]}
                  >
                    Não
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <FormInput
              label="Orçamento Estimado para Imóvel"
              value={estimatedBudget}
              onChangeText={setEstimatedBudget}
              placeholder="€"
              keyboardType="numeric"
              required
              error={errors.estimatedBudget}
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
              title="Solicitar Análise Financeira"
              onPress={handleSubmit}
              loading={loading}
            />

            <WhatsAppButton
              message="Olá Marco, gostaria de fazer uma análise de viabilidade financeira."
              title="Contactar via WhatsApp"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        title="Pedido Enviado!"
        message="Obrigado pelo seu pedido. Marco Neves ou um parceiro financeiro entrará em contacto consigo para analisar a sua situação."
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
    borderLeftColor: COLORS.accent,
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
  loansContainer: {
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
