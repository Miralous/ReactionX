export const prerender = false;

import type { APIRoute } from 'astro';
import { Octokit } from '@octokit/rest';
import {
  cleanupExpiredRecords,
  getClientIP,
  checkRateLimit
} from '~/lib/rateLimit';

export const POST: APIRoute = async ({ request }) => {
  try {
    cleanupExpiredRecords();
    const clientIP = getClientIP(request);
    const limitCheck = checkRateLimit(clientIP);
    if (!limitCheck.allowed) {
      return new Response(JSON.stringify({ error: limitCheck.message }), { status: 429 });
    }

    const body = await request.json();
    const { config, path: customPath } = body;

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    const jwtImport = await import('jsonwebtoken');
    const jwt = jwtImport.default || jwtImport;
    const SECRET = import.meta.env.ADMIN_JWT_SECRET || 'default_secret';

    try {
      jwt.verify(token, SECRET);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), { status: 401 });
    }

    const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
      return new Response(JSON.stringify({ error: 'Server GITHUB_TOKEN missing' }), { status: 500 });
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const listPath = customPath || config.pathPrefix;

    const { data } = await octokit.repos.getContent({
      owner: config.owner,
      repo: config.repo,
      path: listPath,
    });

    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ files: [] }), { status: 200 });
    }

    const extFilter = (name: string) =>
      name.endsWith('.md') || name.endsWith('.mdx') || name.endsWith('.yaml');
    const files = data
      .filter((file) => extFilter(file.name))
      .map((file) => ({
        name: file.name,
        sha: file.sha,
        path: file.path
      }));

    return new Response(JSON.stringify({ files }), { status: 200 });

  } catch (error: any) {
    console.error('List files error:', error);
    if (error.status === 404) {
      return new Response(JSON.stringify({ files: [] }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
