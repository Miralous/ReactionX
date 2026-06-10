export const prerender = false;

import type { APIRoute } from 'astro';
import { Octokit } from '@octokit/rest';
import {
  cleanupExpiredRecords,
  getClientIP,
  checkRateLimit
} from '~/lib/rateLimit';

interface FileOperation {
  type: 'update' | 'create' | 'delete';
  filename: string;
  content?: string;
  isDataFile?: boolean;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    cleanupExpiredRecords();
    const clientIP = getClientIP(request);

    const limitCheck = checkRateLimit(clientIP);
    if (!limitCheck.allowed) return new Response(JSON.stringify({ error: limitCheck.message }), { status: 429 });

    const body = await request.json();
    const { config, operations } = body;

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing token' }), { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    try {
      const jwtImport = await import('jsonwebtoken');
      const jwt = jwtImport.default || jwtImport;
      const SECRET = import.meta.env.ADMIN_JWT_SECRET;
      jwt.verify(token, SECRET || 'default_secret');
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    }

    const octokit = new Octokit({ auth: import.meta.env.GITHUB_TOKEN });
    const { owner, repo, branch, pathPrefix } = config;

    const uniqueOpsMap = new Map<string, any>();

    (operations as FileOperation[]).forEach((op) => {
      const fullPath = op.isDataFile || op.filename.includes('/')
          ? op.filename
          : `${pathPrefix}${op.filename}`;
      uniqueOpsMap.set(fullPath, { ...op, finalPath: fullPath });
    });

    const distinctOperations = Array.from(uniqueOpsMap.values());

    if (distinctOperations.length === 0) {
        return new Response(JSON.stringify({ success: true, message: 'No changes to commit' }), { status: 200 });
    }

    const { data: refData } = await octokit.git.getRef({
      owner, repo, ref: `heads/${branch}`,
    });
    const baseTreeSha = refData.object.sha;

    const tree = await Promise.all(
      distinctOperations.map(async (item: any) => {
        if (item.type === 'delete') {
          return {
            path: item.finalPath,
            mode: '100644',
            type: 'blob',
            sha: null,
          };
        } else {
          const { data: blobData } = await octokit.git.createBlob({
            owner, repo,
            content: Buffer.from(item.content || '').toString('base64'),
            encoding: 'base64',
          });
          return {
            path: item.finalPath,
            mode: '100644',
            type: 'blob',
            sha: blobData.sha,
          };
        }
      })
    );

    const { data: newTree } = await octokit.git.createTree({
      owner, repo, base_tree: baseTreeSha, tree: tree as any,
    });

    const commitMessage = `chore(batch): update ${distinctOperations.length} files`;
    const { data: commit } = await octokit.git.createCommit({
      owner, repo, message: commitMessage, tree: newTree.sha, parents: [baseTreeSha],
    });

    await octokit.git.updateRef({
      owner, repo, ref: `heads/${branch}`, sha: commit.sha, force: false,
    });

    return new Response(JSON.stringify({ success: true, commitSha: commit.sha }), { status: 200 });

  } catch (error: any) {
    console.error('[Batch Error]', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};
