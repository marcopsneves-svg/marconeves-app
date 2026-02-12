const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const API_BASE = `${BACKEND_URL}/api`;

// Check if we're in demo mode (no backend)
const isDemoMode = !BACKEND_URL || BACKEND_URL === '';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Demo mode - simulate successful API responses
function demoResponse<T>(data: any): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Demo Mode - Form submitted:', data);
      resolve({ data: { success: true, message: 'Dados enviados com sucesso!' } as T });
    }, 1000);
  });
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  // If in demo mode, return simulated success
  if (isDemoMode) {
    const body = options?.body ? JSON.parse(options.body as string) : {};
    return demoResponse<T>(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error: any) {
    console.error('API Error:', error);
    return { error: error.message || 'Erro de conexão. Tente novamente.' };
  }
}

// Contact API
export const createContact = (data: any) =>
  apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Referral API
export const createReferral = (data: any) =>
  apiRequest('/referrals', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Seller API
export const createSeller = (data: any) =>
  apiRequest('/sellers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Buyer API
export const createBuyer = (data: any) =>
  apiRequest('/buyers', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Market Study API
export const createMarketStudy = (data: any) =>
  apiRequest('/market-studies', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Financial API
export const createFinancial = (data: any) =>
  apiRequest('/financial', {
    method: 'POST',
    body: JSON.stringify(data),
  });

// Admin API
export const getAllLeads = () => apiRequest('/admin/leads');

export default {
  createContact,
  createReferral,
  createSeller,
  createBuyer,
  createMarketStudy,
  createFinancial,
  getAllLeads,
};
