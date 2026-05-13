// Iyzico REST API helper — Deno/Edge Function compatible

export function objectToPKIString(obj: unknown): string {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return String(obj);

  if (Array.isArray(obj)) {
    return '[' + (obj as unknown[]).map((item) =>
      typeof item === 'object' ? objectToPKIString(item) : String(item)
    ).join(',') + ']';
  }

  const parts: string[] = [];
  for (const key of Object.keys(obj as Record<string, unknown>)) {
    const val = (obj as Record<string, unknown>)[key];
    if (val === null || val === undefined) continue;
    if (Array.isArray(val)) {
      const items = (val as unknown[]).map((item) =>
        typeof item === 'object' ? objectToPKIString(item) : String(item)
      ).join(',');
      parts.push(`${key}=[${items}]`);
    } else if (typeof val === 'object') {
      parts.push(`${key}=${objectToPKIString(val)}`);
    } else {
      parts.push(`${key}=${val}`);
    }
  }
  return '[' + parts.join(',') + ']';
}

// iyzipay v2 hash: SHA-256(apiKey + randomKey + secretKey + pkiString) → base64
export async function generateIyzicoHash(
  apiKey: string,
  secretKey: string,
  randomKey: string,
  pkiString: string,
): Promise<string> {
  const hashStr = apiKey + randomKey + secretKey + pkiString;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashStr));
  const bytes = new Uint8Array(hashBuffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function callIyzico(
  method: string,
  path: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const apiKey = Deno.env.get('IYZICO_API_KEY')!;
  const secretKey = Deno.env.get('IYZICO_SECRET_KEY')!;
  const baseUrl = Deno.env.get('IYZICO_BASE_URL') || 'https://sandbox-api.iyzipay.com';

  const randomKey = crypto.randomUUID().replace(/-/g, '');
  const pkiString = objectToPKIString(body);
  const hash = await generateIyzicoHash(apiKey, secretKey, randomKey, pkiString);

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `IYZWS apiKey:${apiKey}&randomKey:${randomKey}&signature:${hash}`,
      'x-iyzi-rnd': randomKey,
      'x-iyzi-client-version': 'iyzipay-node-2.0.67',
    },
    body: JSON.stringify(body),
  });

  return response.json();
}
