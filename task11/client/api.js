const API_URL = 'http://localhost:3001';

async function request(url, options = {}) {
    const response = await fetch(`${API_URL}${url}`, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'Ошибка запроса');
    }

    return data;
}

export function getCategories() {
    return request('/categories');
}

export function getTransactions(filters = {}) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            params.append(key, value);
        }
    }

    const query = params.toString();

    return request(`/transactions${query ? `?${query}` : ''}`);
}

export function createTransaction(transaction) {
    return request('/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });
}

export function updateTransaction(id, transaction) {
    return request(`/transactions/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });
}

export function deleteTransaction(id) {
    return request(`/transactions/${id}`, {
        method: 'DELETE'
    });
}
export function createCategory(category) {
    return request('/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category)
    });
}
