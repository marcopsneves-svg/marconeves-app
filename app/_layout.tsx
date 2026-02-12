import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING } from '../src/constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: COLORS.textMuted,
          tabBarStyle: {
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: SPACING.xs,
            paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.sm,
            height: Platform.OS === 'ios' ? 88 : 70,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 2,
          },
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Contacto',
            headerTitle: 'Marco Neves | Consultor Imobiliário',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="call" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="referral"
          options={{
            title: 'Recomendar',
            headerTitle: 'Recomendar & Ganhar',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="gift" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="sell"
          options={{
            title: 'Vender',
            headerTitle: 'Vender Imóvel',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-export-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="buy"
          options={{
            title: 'Comprar',
            headerTitle: 'Comprar Imóvel',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-import-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="market"
          options={{
            title: 'Mercado',
            headerTitle: 'Estudo de Mercado',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="financial"
          options={{
            title: 'Viabilidade',
            headerTitle: 'Viabilidade Financeira',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="calculator" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            title: 'Admin',
            headerTitle: 'Painel de Leads',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
