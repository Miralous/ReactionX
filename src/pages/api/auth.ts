export const prerender = false;

import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import {
  cleanupExpiredRecords,
  getClientIP,
  checkRateLimit,
  recordFailedAttempt,
  clearRecord
} from '~/lib/rateLimit';

import fs from 'node:fs';
import path from 'node:path';

async function getJwt() {
  const imported = await import('jsonwebtoken');
  return imported.default || imported;
}

function getAdminPassword(): string {
  // Read .env directly to avoid Vite's dotenv-expand stripping $ signs from bcrypt hash
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const match = envContent.match(/^ADMIN_PASSWORD=(.+)$/m);
    if (match) {
      return match[1].replace(/^['"]|['"]$/g, '');
    }
  } catch {}
  return import.meta.env.ADMIN_PASSWORD || '';
}

export const POST: APIRoute = async ({ request }) => {
  try {
    cleanupExpiredRecords();
    const clientIP = getClientIP(request);

    const limitCheck = checkRateLimit(clientIP);
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({ error: limitCheck.message || 'Rate limit exceeded' }), { status: 429 });
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({ error: 'Password required' }), { status: 403 });
    }

    const HASHED_PASSWORD = getAdminPassword();
    if (!HASHED_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: ADMIN_PASSWORD missing' }), { status: 500 });
    }

    const isMatch = await bcrypt.compare(password, HASHED_PASSWORD);

    if (isMatch) {
      clearRecord(clientIP);
      const jwt = await getJwt();
      const SECRET = import.meta.env.ADMIN_JWT_SECRET || 'default_secret';
      const token = jwt.sign({ ip: clientIP, ts: Date.now() }, SECRET, { expiresIn: '2h' });
      return new Response(JSON.stringify({ success: true, token }), { status: 200 });
    } else {
      recordFailedAttempt(clientIP);
      return new Response(JSON.stringify({ error: 'Wrong password' }), { status: 401 });
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: 'Invalid request', detail: errorMessage }), { status: 400 });
  }
};
