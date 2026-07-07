function resolveApiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && window.location.protocol === 'https:' && raw.startsWith('http://')) {
    return raw.replace(/^http:/, 'https:');
  }
  return raw;
}

const API_URL = resolveApiUrl();

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  Object.assign(headers, options.headers);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || 'API Request failed');
  }

  return response.json();
}
