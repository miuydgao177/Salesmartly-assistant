#!/usr/bin/env node

const http = require('http');

const PORT = Number(process.env.IMAGE_BOT_PORT || 3010);

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  response.end(JSON.stringify(payload, null, 2));
}

function detectDestination(text) {
  if (
    text.includes('zhangjiajie') ||
    text.includes('zhang jia jie') ||
    text.includes('avatar mountains') ||
    text.includes('tianmen mountain')
  ) {
    return 'zhangjiajie';
  }

  return null;
}

function buildResponse(messages) {
  const mergedText = normalizeText((messages || []).join(' '));
  const destination = detectDestination(mergedText);

  if (!destination) {
    return {
      destination: null,
      confidence: 'low',
      contentPackId: null,
      matchedTerms: {},
      blockedReason: 'missing_destination'
    };
  }

  return {
    destination,
    confidence: 'high',
    contentPackId: `${destination}-destination`,
    matchedTerms: {
      destination: {
        [destination]: [destination]
      }
    },
    blockedReason: null
  };
}

const server = http.createServer((request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {});
    return;
  }

  if (request.method !== 'POST' || request.url !== '/recommendation') {
    sendJson(response, 404, {
      error: 'not_found'
    });
    return;
  }

  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', () => {
    try {
      const parsed = JSON.parse(body || '{}');
      const messages = Array.isArray(parsed.messages) ? parsed.messages : [];
      sendJson(response, 200, buildResponse(messages));
    } catch (error) {
      sendJson(response, 400, {
        error: 'invalid_json'
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Mock image bot server listening on http://127.0.0.1:${PORT}/recommendation`);
});
