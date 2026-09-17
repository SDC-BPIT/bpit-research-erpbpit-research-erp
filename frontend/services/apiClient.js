const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getAuthHeaders(extraHeaders = {}) {
  const headers = { ...extraHeaders };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('erp_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

export async function apiGet(url) {
  const r = await fetch(API_URL + url, {
    credentials: 'include',
    headers: getAuthHeaders()
  });
  if (!r.ok) {
    const errData = await r.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${r.status}`);
  }
  return r.json();
}

export async function apiPost(url, body) {
  const r = await fetch(API_URL + url, {
    method: 'POST',
    credentials: 'include',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const errData = await r.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${r.status}`);
  }
  return r.json();
}

export async function apiPut(url, body) {
  const r = await fetch(API_URL + url, {
    method: 'PUT',
    credentials: 'include',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const errData = await r.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${r.status}`);
  }
  return r.json();
}

export async function apiDelete(url) {
  const r = await fetch(API_URL + url, {
    method: 'DELETE',
    credentials: 'include',
    headers: getAuthHeaders()
  });
  if (!r.ok) {
    const errData = await r.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error! status: ${r.status}`);
  }
  return r.json();
}
