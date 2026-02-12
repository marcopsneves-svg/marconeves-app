import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS } from '../src/constants/theme';
import AdminAuth from '../src/components/AdminAuth';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

interface Lead {
  id: string;
  name?: string;
  referrer_name?: string;
  phone?: string;
  referrer_phone?: string;
  email?: string;
  referrer_email?: string;
  timestamp: string;
  status?: string;
  source: string;
  [key: string]: any;
}

interface LeadsData {
  summary: {
    total_contacts: number;
    total_referrals: number;
    total_sellers: number;
    total_buyers: number;
    total_market_studies: number;
    total_financial: number;
    grand_total: number;
  };
  contacts: Lead[];
  referrals: Lead[];
  sellers: Lead[];
  buyers: Lead[];
  market_studies: Lead[];
  financial: Lead[];
}

type LeadType = 'all' | 'contacts' | 'referrals' | 'sellers' | 'buyers' | 'market_studies' | 'financial';

const LEAD_TYPES: { key: LeadType; label: string; icon: string; color: string }[] = [
  { key: 'all', label: 'Todos', icon: 'apps', color: COLORS.primary },
  { key: 'contacts', label: 'Contactos', icon: 'call', color: '#3498db' },
  { key: 'referrals', label: 'Referências', icon: 'gift', color: '#e74c3c' },
  { key: 'sellers', label: 'Vendedores', icon: 'home-export-outline', color: '#2ecc71' },
  { key: 'buyers', label: 'Compradores', icon: 'home-import-outline', color: '#9b59b6' },
  { key: 'market_studies', label: 'Estudos', icon: 'stats-chart', color: '#f39c12' },
  { key: 'financial', label: 'Financeiro', icon: 'calculator', color: '#1abc9c' },
];

export default function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<LeadType>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/leads`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching leads:', error);
      Alert.alert('Erro', 'Não foi possível carregar os leads.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLeads();
  }, []);

  const getFilteredLeads = (): Lead[] => {
    if (!data) return [];
    
    if (selectedType === 'all') {
      const allLeads = [
        ...data.contacts,
        ...data.referrals,
        ...data.sellers,
        ...data.buyers,
        ...data.market_studies,
        ...data.financial,
      ];
      return allLeads.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
    
    return data[selectedType] || [];
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLeadName = (lead: Lead) => {
    return lead.name || lead.referrer_name || 'Sem nome';
  };

  const getLeadPhone = (lead: Lead) => {
    return lead.phone || lead.referrer_phone || '';
  };

  const getLeadEmail = (lead: Lead) => {
    return lead.email || lead.referrer_email || '';
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'Contact Section': '#3498db',
      'Referral': '#e74c3c',
      'Sell': '#2ecc71',
      'Buy': '#9b59b6',
      'Market Study': '#f39c12',
      'Financial': '#1abc9c',
    };
    return colors[source] || COLORS.textMuted;
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      'Contact Section': 'Contacto',
      'Referral': 'Referência',
      'Sell': 'Vender',
      'Buy': 'Comprar',
      'Market Study': 'Estudo',
      'Financial': 'Financeiro',
    };
    return labels[source] || source;
  };

  const renderIcon = (iconName: string, color: string) => {
    if (iconName === 'gift' || iconName === 'home-export-outline' || iconName === 'home-import-outline') {
      return <MaterialCommunityIcons name={iconName as any} size={20} color={color} />;
    }
    if (iconName === 'calculator') {
      return <FontAwesome5 name={iconName} size={16} color={color} />;
    }
    return <Ionicons name={iconName as any} size={20} color={color} />;
  };

  const renderLeadDetails = () => {
    if (!selectedLead) return null;

    const details = Object.entries(selectedLead).filter(
      ([key]) => !['id', 'timestamp', 'gdpr_consent'].includes(key)
    );

    const labelMap: Record<string, string> = {
      name: 'Nome',
      phone: 'Telefone',
      email: 'Email',
      message: 'Mensagem',
      source: 'Origem',
      status: 'Estado',
      referrer_name: 'Nome (Referenciador)',
      referrer_phone: 'Telefone (Referenciador)',
      referrer_email: 'Email (Referenciador)',
      seller_name: 'Nome (Vendedor)',
      seller_phone: 'Telefone (Vendedor)',
      seller_email: 'Email (Vendedor)',
      property_location: 'Localização',
      property_type: 'Tipo de Imóvel',
      location: 'Localização',
      estimated_price: 'Preço Estimado',
      urgency: 'Urgência',
      notes: 'Notas',
      budget: 'Orçamento',
      financing_needed: 'Financiamento',
      timeline: 'Prazo',
      property_size: 'Área (m²)',
      employment_status: 'Situação Profissional',
      monthly_income: 'Rendimento Mensal',
      existing_loans: 'Créditos em Curso',
      estimated_budget: 'Orçamento Estimado',
      permission_confirmed: 'Permissão Confirmada',
    };

    return (
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes do Lead</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalSourceBadge}>
              <Text style={[styles.sourceBadgeText, { backgroundColor: getSourceColor(selectedLead.source) }]}>
                {getSourceLabel(selectedLead.source)}
              </Text>
              <Text style={styles.modalDate}>{formatDate(selectedLead.timestamp)}</Text>
            </View>

            <ScrollView style={styles.modalScroll}>
              {details.map(([key, value]) => {
                if (value === null || value === undefined || value === '') return null;
                
                let displayValue = value;
                if (typeof value === 'boolean') {
                  displayValue = value ? 'Sim' : 'Não';
                }

                return (
                  <View key={key} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{labelMap[key] || key}</Text>
                    <Text style={styles.detailValue}>{String(displayValue)}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Show authentication screen if not authenticated
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <AdminAuth
          visible={!isAuthenticated}
          onAuthenticated={() => setIsAuthenticated(true)}
        />
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>A carregar leads...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredLeads = getFilteredLeads();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Summary Cards */}
      <Animated.View 
        entering={FadeIn.delay(100).duration(400)}
        style={styles.summaryContainer}
      >
        <View style={styles.totalCard}>
          <Text style={styles.totalNumber}>{data?.summary.grand_total || 0}</Text>
          <Text style={styles.totalLabel}>Total de Leads</Text>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.ScrollView 
        entering={FadeInDown.delay(200).duration(400)}
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {LEAD_TYPES.map((type) => {
          const count = type.key === 'all' 
            ? data?.summary.grand_total 
            : data?.summary[`total_${type.key}` as keyof typeof data.summary];
          
          return (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.filterTab,
                selectedType === type.key && styles.filterTabActive,
              ]}
              onPress={() => setSelectedType(type.key)}
            >
              {renderIcon(type.icon, selectedType === type.key ? COLORS.white : type.color)}
              <Text style={[
                styles.filterTabText,
                selectedType === type.key && styles.filterTabTextActive,
              ]}>
                {type.label}
              </Text>
              {count !== undefined && count > 0 && (
                <View style={[
                  styles.badge,
                  selectedType === type.key && styles.badgeActive,
                ]}>
                  <Text style={[
                    styles.badgeText,
                    selectedType === type.key && styles.badgeTextActive,
                  ]}>{count}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>

      {/* Leads List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredLeads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Nenhum lead encontrado</Text>
          </View>
        ) : (
          filteredLeads.map((lead) => (
            <TouchableOpacity
              key={lead.id}
              style={styles.leadCard}
              onPress={() => {
                setSelectedLead(lead);
                setModalVisible(true);
              }}
            >
              <View style={styles.leadHeader}>
                <View style={[styles.sourceIndicator, { backgroundColor: getSourceColor(lead.source) }]} />
                <View style={styles.leadInfo}>
                  <Text style={styles.leadName}>{getLeadName(lead)}</Text>
                  <Text style={styles.leadContact}>{getLeadPhone(lead)}</Text>
                  {getLeadEmail(lead) && (
                    <Text style={styles.leadEmail}>{getLeadEmail(lead)}</Text>
                  )}
                </View>
                <View style={styles.leadMeta}>
                  <Text style={[styles.sourceTag, { color: getSourceColor(lead.source) }]}>
                    {getSourceLabel(lead.source)}
                  </Text>
                  <Text style={styles.leadDate}>{formatDate(lead.timestamp)}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} style={styles.chevron} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {renderLeadDetails()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  summaryContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.primary,
  },
  totalCard: {
    alignItems: 'center',
  },
  totalNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  totalLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
  filterContainer: {
    maxHeight: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContent: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 13,
    color: COLORS.text,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
    paddingHorizontal: 6,
  },
  badgeActive: {
    backgroundColor: COLORS.white,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  badgeTextActive: {
    color: COLORS.primary,
  },
  listContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
  leadCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leadHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: SPACING.md,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  leadContact: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  leadEmail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  leadMeta: {
    alignItems: 'flex-end',
  },
  sourceTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  leadDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  chevron: {
    marginLeft: SPACING.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    maxHeight: '80%',
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalSourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
  },
  sourceBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  modalDate: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  modalScroll: {
    padding: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  detailValue: {
    flex: 2,
    fontSize: 14,
    color: COLORS.text,
  },
});
