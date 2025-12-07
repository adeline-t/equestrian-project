import { createClient } from '@supabase/supabase-js';

export function getDatabase(env) {
  // Use SUPABASE_ANON_KEY instead of SUPABASE_KEY
  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY || env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_ANON_KEY');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Helper function to handle database errors
export function handleDbError(error, request = null) {
  console.error('Database error:', error);

  // Handle specific error codes
  if (error.code === 'PGRST116') {
    return jsonResponse({ error: 'Enregistrement non trouvé' }, 404);
  }

  if (error.code === '23505') {
    return jsonResponse({ error: 'Cet enregistrement existe déjà' }, 409);
  }

  if (error.code === '23503') {
    return jsonResponse({ error: 'Référence invalide' }, 400);
  }

  // Log full error for debugging
  console.error('Full error details:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
  });

  return jsonResponse(
    {
      error: 'Erreur de base de données',
      message: error.message,
      details: error.details || 'Aucun détail disponible',
    },
    500
  );
}

// Helper function to create JSON response
export function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };

  return new Response(JSON.stringify(data), {
    status,
    headers: { ...defaultHeaders, ...headers },
  });
}

// Validation helpers
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone) {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  return !phone || phoneRegex.test(phone);
}

// FIXED: Allow 0 and false as valid values
export function validateRequired(fields, data) {
  const missing = fields.filter((field) => {
    const value = data[field];
    // Field is missing only if undefined, null, or empty string
    // 0 and false are considered valid values
    return value === undefined || value === null || value === '';
  });
  return missing.length === 0 ? null : missing.join(', ');
}

// Rate limiting (in-memory, for Workers)
const rateLimitStore = new Map();

export function checkRateLimit(clientId, limit = 100, windowMs = 60000) {
  const now = Date.now();
  const key = `rate_limit:${clientId}`;

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 0, resetTime: now + windowMs });
  }

  const record = rateLimitStore.get(key);

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + windowMs;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

// Security headers
export function getSecurityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
}
