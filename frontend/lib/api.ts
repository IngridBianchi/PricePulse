const rawUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
const API_URL = typeof window !== 'undefined' && window.location.protocol === 'https:' && rawUrl.startsWith('http://')
  ? rawUrl.replace(/^http:/i, 'https:')
  : rawUrl;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

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
