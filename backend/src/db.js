import { createClient } from '@supabase/supabase-js';

export function getDatabase(env) {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_KEY
  );
}

// Helper function to handle database errors
export function handleDbError(error) {
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
  
  return jsonResponse(
    { error: 'Erreur de base de données' },
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}

// Helper function to create JSON response
export function jsonResponse(data, status = 200, headers = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...defaultHeaders, ...headers }
    }
  );
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

export function validateRequired(fields, data) {
  const missing = fields.filter(field => !data[field]);
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