const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';
const API_BASE = `${BACKEND_URL}/api`;
const NOTION_TOKEN = process.env.EXPO_PUBLIC_NOTION_TOKEN || '';

const isDemoMode = !BACKEND_URL || BACKEND_URL === '';
const useNotion = !!NOTION_TOKEN;

// IDs das bases de dados Notion criadas
const NOTION_DATABASES = {
  contacts:      'c22a596f-db1b-4744-ba3c-1ccecc88f2a6',
  referrals:     'd9dcd355-4e83-49de-a338-c2f794146247',
  sellers:       'abfb3f1e-96ea-41f1-8249-dc89cded027f',
  buyers:        '918713cd-5e69-4836-bbe4-b7cb395ae5cd',
  marketStudies: 'e9f80db3-04e1-419c-b232-e2bda31e2656',
  financial:     '5d78b41d-d6d0-40f2-a654-6fe9c438738a',
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// --- Notion helpers ---

function notionText(value: string) {
  return { rich_text: [{ text: { content: String(value || '') } }] };
}

function notionTitle(value: string) {
  return { title: [{ text: { content: String(value || '') } }] };
}

async function saveToNotion(databaseId: string, properties: Record<string, any>) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Notion error: ${res.status}`);
  }
  return res.json();
}

// --- Demo mode ---

function demoResponse<T>(data: any): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Demo Mode - Form submitted:', data);
      resolve({ data: { success: true, message: 'Dados enviados com sucesso!' } as T });
    }, 1000);
  });
}

// --- Backend request ---

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  if (isDemoMode) {
    const body = options?.body ? JSON.parse(options.body as string) : {};
    return demoResponse<T>(body);
  }
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error: ${response.status}`);
    }
    return { data: await response.json() };
  } catch (error: any) {
    console.error('API Error:', error);
    return { error: error.message || 'Erro de conexão. Tente novamente.' };
  }
}

// =====================
// Contact API
// =====================
export const createContact = async (data: any): Promise<ApiResponse<any>> => {
  if (useNotion) {
    try {
      await saveToNotion(NOTION_DATABASES.contacts, {
        'Nome':      notionTitle(data.nome || data.name || ''),
        'Email':     { email: data.email || '' },
        'Telefone':  { phone_number: data.telefone || data.phone || '' },
        'Mensagem':  notionText(data.mensagem || data.message || ''),
      });
      return { data: { success: true, message: 'Contacto guardado!' } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  return apiRequest('/contacts', { method: 'POST', body: JSON.stringify(data) });
};

// =====================
// Referral API
// =====================
export const createReferral = async (data: any): Promise<ApiResponse<any>> => {
  if (useNotion) {
    try {
      await saveToNotion(NOTION_DATABASES.referrals, {
        'Nome':         notionTitle(data.nome || data.name || ''),
        'Email':        { email: data.email || '' },
        'Telefone':     { phone_number: data.telefone || data.phone || '' },
        'Referido Por': notionText(data.referidoPor || data.referredBy || ''),
        'Notas':        notionText(data.notas || data.notes || ''),
      });
      return { data: { success: true, message: 'Referência guardada!' } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  return apiRequest('/referrals', { method: 'POST', body: JSON.stringify(data) });
};

// =====================
// Seller API
// =====================
export const createSeller = async (data: any): Promise<ApiResponse<any>> => {
  if (useNotion) {
    try {
      await saveToNotion(NOTION_DATABASES.sellers, {
        'Nome':             notionTitle(data.nome || data.name || ''),
        'Email':            { email: data.email || '' },
        'Telefone':         { phone_number: data.telefone || data.phone || '' },
        'Morada Imóvel':    notionText(data.morada || data.address || ''),
        'Tipo Imóvel':      { select: { name: data.tipoImovel || data.propertyType || 'Apartamento' } },
        'Preço Pretendido': { number: Number(data.preco || data.price || 0) },
        'Notas':            notionText(data.notas || data.notes || ''),
      });
      return { data: { success: true, message: 'Vendedor guardado!' } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  return apiRequest('/sellers', { method: 'POST', body: JSON.stringify(data) });
};

// =====================
// Buyer API
// =====================
export const createBuyer = async (data: any): Promise<ApiResponse<any>> => {
  if (useNotion) {
    try {
      await saveToNotion(NOTION_DATABASES.buyers, {
        'Nome':             notionTitle(data.nome || data.name || ''),
        'Email':            { email: data.email || '' },
        'Telefone':         { phone_number: data.telefone || data.phone || '' },
        'Zona Pretendida':  notionText(data.zona || data.zone || ''),
        'Tipo Imóvel':      { select: { name: data.tipoImovel || data.propertyType || 'Apartamento' } },
        'Orçamento Máximo': { number: Number(data.orcamento || data.budget || 0) },
        'Notas':            notionText(data.notas || data.notes || ''),
      });
      return { data: { success: true, message: 'Comprador guardado!' } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  return apiRequest('/buyers', { method: 'POST', body: JSON.stringify(data) });
};

// =====================
// Market Study API
// =====================
export const createMarketStudy = async (data: any): Promise<ApiResponse<any>> => {
  if (useNotion) {
    try {
      await saveToNotion(NOTION_DATABASES.marketStudies, {
        'Morada':           notionTitle(data.morada || data.address || ''),
        'Email Solicitante':{ email: data.email || '' },
        'Telefone':         { phone_number: data.telefone || data.phone || '' },
        'Tipo Imóvel':      { select: { name: data.tipoImovel || data.propertyType || 'Apartamento' } },
        'Área (m²)':        { number: Number(data.area || 0) },
        'Notas':            notionText(data.notas || data.notes || ''),
      });
      return { data: { success: true, message: 'Estudo de mercado guardado!' } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  return apiRequest('/market-studies', { method: 'POST', body: JSON.stringify(data) });
};

// =====================
// Financial API
// =====================
export const createFinancial = async (data: any): Promise<ApiResponse<any>> => {
  if (useNotion) {
    try {
      await saveToNotion(NOTION_DATABASES.financial, {
        'Nome':              notionTitle(data.nome || data.name || ''),
        'Email':             { email: data.email || '' },
        'Telefone':          { phone_number: data.telefone || data.phone || '' },
        'Rendimento Mensal': { number: Number(data.rendimento || data.income || 0) },
        'Valor Imóvel':      { number: Number(data.valorImovel || data.propertyValue || 0) },
        'Notas':             notionText(data.notas || data.notes || ''),
      });
      return { data: { success: true, message: 'Simulação financeira guardada!' } };
    } catch (e: any) {
      return { error: e.message };
    }
  }
  return apiRequest('/financial', { method: 'POST', body: JSON.stringify(data) });
};

// =====================
// Admin API
// =====================
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
```


