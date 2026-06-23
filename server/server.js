import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDefaultProfile } from '../src/data/defaultProfile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const dataDir = process.env.DATA_DIR || path.join(rootDir, 'data');
const profilePath = path.join(dataDir, 'profile.json');
const ownerPort = Number(process.env.OWNER_PORT || 3000);
const publicPort = Number(process.env.PUBLIC_PORT || 3001);
const maxBodyBytes = 8 * 1024 * 1024;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, text) {
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(text);
}

async function ensureProfileFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await stat(profilePath);
  } catch {
    await writeFile(profilePath, JSON.stringify(createDefaultProfile(), null, 2), 'utf8');
  }
}

async function readProfile() {
  await ensureProfileFile();
  const content = await readFile(profilePath, 'utf8');
  return JSON.parse(content);
}

function isUrlLike(value) {
  try {
    const parsed = new URL(value);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function isImageValue(value) {
  if (value === '') {
    return true;
  }

  if (/^data:image\/(?:png|jpeg|jpg|webp|gif);base64,/i.test(value)) {
    return value.length <= 3_000_000;
  }

  return isUrlLike(value);
}

function normalizeString(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function sanitizeProfile(input) {
  const defaults = createDefaultProfile();
  const profile = input && typeof input === 'object' ? input : {};
  const links = Array.isArray(profile.links) ? profile.links : defaults.links;

  return {
    name: normalizeString(profile.name || defaults.name, 80),
    handle: normalizeString(profile.handle || defaults.handle, 80),
    bio: normalizeString(profile.bio || defaults.bio, 240),
    photoUrl: isImageValue(profile.photoUrl || '') ? profile.photoUrl || '' : '',
    backgroundUrl: isImageValue(profile.backgroundUrl || '') ? profile.backgroundUrl || '' : '',
    links: links.slice(0, 50).flatMap((link) => {
      if (!link || typeof link !== 'object' || !isUrlLike(link.url)) {
        return [];
      }

      return [
        {
          id: normalizeString(link.id || randomUUID(), 80),
          label: normalizeString(link.label || 'Link', 120),
          networkId: normalizeString(link.networkId || 'website', 60),
          url: normalizeString(link.url, 2048),
        },
      ];
    }),
  };
}

async function readRequestJson(request) {
  const contentType = request.headers['content-type'] || '';

  if (!contentType.includes('application/json')) {
    const error = new Error('Content-Type invalido.');
    error.statusCode = 415;
    throw error;
  }

  const chunks = [];
  let size = 0;

  for await (const chunk of request) {
    size += chunk.length;

    if (size > maxBodyBytes) {
      const error = new Error('Payload muito grande.');
      error.statusCode = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function handleApi(request, response, mode) {
  if (request.method === 'GET') {
    sendJson(response, 200, await readProfile());
    return;
  }

  if (request.method !== 'PUT') {
    sendJson(response, 405, { error: 'Metodo nao permitido.' });
    return;
  }

  if (mode !== 'owner') {
    sendJson(response, 403, { error: 'A porta publica e somente leitura.' });
    return;
  }

  try {
    const body = await readRequestJson(request);
    const profile = sanitizeProfile(body);
    await mkdir(dataDir, { recursive: true });
    await writeFile(profilePath, JSON.stringify(profile, null, 2), 'utf8');
    sendJson(response, 200, profile);
  } catch (error) {
    sendJson(response, error.statusCode || 400, { error: error.message || 'Payload invalido.' });
  }
}

async function serveStatic(request, response) {
  const url = new URL(request.url, 'http://localhost');
  const requestedPath = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const candidatePath = path.normalize(path.join(distDir, requestedPath));
  const resolvedPath = candidatePath.startsWith(distDir) ? candidatePath : path.join(distDir, 'index.html');

  try {
    const fileStat = await stat(resolvedPath);

    if (!fileStat.isFile()) {
      throw new Error('Not a file');
    }

    const extension = path.extname(resolvedPath);
    const cacheControl = extension === '.html' ? 'no-store' : 'public, max-age=2592000, immutable';

    response.writeHead(200, {
      'Cache-Control': cacheControl,
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
    });
    response.end(await readFile(resolvedPath));
  } catch {
    const fallback = path.join(distDir, 'index.html');

    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/html; charset=utf-8',
    });
    response.end(await readFile(fallback));
  }
}

function createApp(mode) {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');

      if (url.pathname === '/health') {
        sendText(response, 200, 'ok');
        return;
      }

      if (url.pathname === '/api/profile') {
        await handleApi(request, response, mode);
        return;
      }

      await serveStatic(request, response);
    } catch {
      sendText(response, 500, 'Erro interno.');
    }
  });
}

await ensureProfileFile();

createApp('owner').listen(ownerPort, '0.0.0.0', () => {
  console.log(`Owner app listening on ${ownerPort}`);
});

createApp('public').listen(publicPort, '0.0.0.0', () => {
  console.log(`Public app listening on ${publicPort}`);
});
