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
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import FormInput from '../src/components/FormInput';
import PrimaryButton from '../src/components/PrimaryButton';
import GDPRCheckbox from '../src/components/GDPRCheckbox';
import SuccessModal from '../src/components/SuccessModal';
import WhatsAppButton from '../src/components/WhatsAppButton';
import Header from '../src/components/Header';
import { createReferral } from '../src/utils/api';

export default function ReferralScreen() {
  // Referrer info
  const [referrerName, setReferrerName] = useState('');
  const [referrerPhone, setReferrerPhone] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  
  // Seller info
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');
  const [notes, setNotes] = useState('');
  
  const [permissionConfirmed, setPermissionConfirmed] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!referrerName.trim()) newErrors.referrerName = 'Nome é obrigatório';
    if (!referrerPhone.trim()) newErrors.referrerPhone = 'Telefone é obrigatório';
    if (!referrerEmail.trim()) {
      newErrors.referrerEmail = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(referrerEmail)) {
      newErrors.referrerEmail = 'Email inválido';
    }
    if (!sellerName.trim()) newErrors.sellerName = 'Nome do vendedor é obrigatório';
    if (!sellerPhone.trim()) newErrors.sellerPhone = 'Telefone do vendedor é obrigatório';
    if (!propertyLocation.trim()) newErrors.propertyLocation = 'Localização é obrigatória';
    if (!permissionConfirmed) newErrors.permission = 'Deve confirmar que tem permissão';
    if (!gdprConsent) newErrors.gdpr = 'Deve aceitar a política de privacidade';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    const { data, error } = await createReferral({
      referrer_name: referrerName,
      referrer_phone: referrerPhone,
      referrer_email: referrerEmail,
      seller_name: sellerName,
      seller_phone: sellerPhone,
      seller_email: sellerEmail || null,
      property_location: propertyLocation,
      notes: notes || null,
      permission_confirmed: permissionConfirmed,
      gdpr_consent: gdprConsent,
    });
    setLoading(false);

    if (error) {
      setErrors({ submit: error });
    } else {
      setShowSuccess(true);
      // Reset form
      setReferrerName('');
      setReferrerPhone('');
      setReferrerEmail('');
      setSellerName('');
      setSellerPhone('');
      setSellerEmail('');
      setPropertyLocation('');
      setNotes('');
      setPermissionConfirmed(false);
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
            title="Recomendar & Ganhar €300"
            subtitle="Recomende alguém que queira vender o seu imóvel e receba um cartão presente de €300 após a conclusão do negócio."
          />

          <View style={styles.rewardCard}>
            <Ionicons name="gift" size={32} color={COLORS.accent} />
            <Text style={styles.rewardText}>Ganhe €300 em vale de compras!</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Seus Dados (Referenciador)</Text>
            
            <FormInput
              label="Nome Completo"
              value={referrerName}
              onChangeText={setReferrerName}
              placeholder="Seu nome"
              required
              error={errors.referrerName}
            />

            <FormInput
              label="Telefone"
              value={referrerPhone}
              onChangeText={setReferrerPhone}
              placeholder="+351 XXX XXX XXX"
              keyboardType="phone-pad"
              required
              error={errors.referrerPhone}
            />

            <FormInput
              label="Email"
              value={referrerEmail}
              onChangeText={setReferrerEmail}
              placeholder="seu.email@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
              error={errors.referrerEmail}
            />

            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Dados do Vendedor</Text>

            <FormInput
              label="Nome Completo"
              value={sellerName}
              onChangeText={setSellerName}
              placeholder="Nome do vendedor"
              required
              error={errors.sellerName}
            />

            <FormInput
              label="Telefone"
              value={sellerPhone}
              onChangeText={setSellerPhone}
              placeholder="+351 XXX XXX XXX"
              keyboardType="phone-pad"
              required
              error={errors.sellerPhone}
            />

            <FormInput
              label="Email"
              value={sellerEmail}
              onChangeText={setSellerEmail}
              placeholder="email@exemplo.com (opcional)"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Localização do Imóvel"
              value={propertyLocation}
              onChangeText={setPropertyLocation}
              placeholder="Ex: Lisboa, Cascais, Porto..."
              required
              error={errors.propertyLocation}
            />

            <FormInput
              label="Notas Adicionais"
              value={notes}
              onChangeText={setNotes}
              placeholder="Informações adicionais (opcional)"
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={styles.permissionRow}
              onPress={() => setPermissionConfirmed(!permissionConfirmed)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, permissionConfirmed && styles.checked, errors.permission && styles.checkboxError]}>
                {permissionConfirmed && <Ionicons name="checkmark" size={18} color={COLORS.white} />}
              </View>
              <Text style={styles.permissionText}>
                Confirmo que tenho permissão para partilhar este contacto.
              </Text>
            </TouchableOpacity>
            {errors.permission && <Text style={styles.errorText}>{errors.permission}</Text>}

            <GDPRCheckbox
              checked={gdprConsent}
              onToggle={() => setGdprConsent(!gdprConsent)}
              error={errors.gdpr}
            />

            {errors.submit && (
              <Text style={styles.submitError}>{errors.submit}</Text>
            )}

            <PrimaryButton
              title="Enviar Recomendação"
              onPress={handleSubmit}
              loading={loading}
            />

            <WhatsAppButton
              message="Olá Marco, gostaria de recomendar alguém que quer vender um imóvel."
              title="Contactar via WhatsApp"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        title="Recomendação Enviada!"
        message="Obrigado pela sua recomendação. Entraremos em contacto consigo após a conclusão do negócio para entregar o seu prémio de €300."
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
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderStyle: 'dashed',
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: SPACING.md,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.lg,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.xs,
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
  permissionText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: SPACING.sm,
    marginLeft: 32,
  },
  submitError: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
