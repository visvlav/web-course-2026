// Все запросы к серверу. Здесь нет ни DOM, ни состояния.
const BASE_URL = 'http://localhost:3001';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(BASE_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Сервер недоступен. Проверьте, что он запущен на порту 3001');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || `Ошибка сервера (${response.status})`);
  }
  return data;
}

export function getCategories() {
  return request('/categories');
}

export function createCategory(category) {
  return request('/categories', { method: 'POST', body: JSON.stringify(category) });
}

// Фильтры уходят на сервер как query-параметры, фильтрует SQL
export function getTransactions(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const query = params.toString();
  return request('/transactions' + (query ? `?${query}` : ''));
}

export function createTransaction(transaction) {
  return request('/transactions', { method: 'POST', body: JSON.stringify(transaction) });
}

export function updateTransaction(id, transaction) {
  return request(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(transaction) });
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, { method: 'DELETE' });
}
