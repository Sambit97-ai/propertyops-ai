import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'propertyops_supabase_url';
const STORAGE_KEY_KEY = 'propertyops_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  source: 'env' | 'localStorage' | 'none';
}

/**
 * Get active Supabase configuration from environment variables or localStorage
 */
export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_URL) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_KEY) || '' : '';

  if (localUrl && localKey) {
    return {
      url: localUrl.trim(),
      anonKey: localKey.trim(),
      isConfigured: isValidUrl(localUrl),
      source: 'localStorage',
    };
  }

  if (envUrl && envKey) {
    return {
      url: envUrl.trim(),
      anonKey: envKey.trim(),
      isConfigured: isValidUrl(envUrl),
      source: 'env',
    };
  }

  return {
    url: '',
    anonKey: '',
    isConfigured: false,
    source: 'none',
  };
}

function isValidUrl(str: string): boolean {
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

/**
 * Get the Supabase client instance if configured, otherwise null
 */
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (cachedClient && lastUsedUrl === config.url && lastUsedKey === config.anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: 'public',
      },
    });
    lastUsedUrl = config.url;
    lastUsedKey = config.anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Save custom Supabase credentials to localStorage
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
      localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY_URL);
      localStorage.removeItem(STORAGE_KEY_KEY);
    }
    cachedClient = null;
    lastUsedUrl = '';
    lastUsedKey = '';
  }
}

/**
 * Test Supabase connection and verify tables
 */
export async function testSupabaseConnection(
  url?: string, 
  anonKey?: string
): Promise<{ success: boolean; message: string; tableCount?: number }> {
  try {
    const testUrl = url || getSupabaseConfig().url;
    const testKey = anonKey || getSupabaseConfig().anonKey;

    if (!testUrl || !testKey || !isValidUrl(testUrl)) {
      return { success: false, message: 'Invalid Supabase URL or Anon Key provided.' };
    }

    const testClient = createClient(testUrl, testKey, {
      auth: { persistSession: false },
    });

    // Attempt to query properties table
    const { data, error } = await testClient
      .from('properties')
      .select('id, name')
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        return { 
          success: false, 
          message: 'Connected to Supabase, but schema tables (properties, tickets, etc.) do not exist yet. Please execute supabase/setup_complete.sql in the Supabase SQL Editor.' 
        };
      }
      return { success: false, message: `Supabase error: ${error.message} (Code: ${error.code})` };
    }

    return { 
      success: true, 
      message: `Successfully connected to Supabase! (${data?.length ?? 0} properties found in query)`,
      tableCount: data ? 1 : 0
    };
  } catch (err: any) {
    return { success: false, message: `Connection failed: ${err.message || 'Unknown network error'}` };
  }
}
