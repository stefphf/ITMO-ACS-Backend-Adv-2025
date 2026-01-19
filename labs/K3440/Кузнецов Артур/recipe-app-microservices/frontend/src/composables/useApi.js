import { API_BASE, TOKEN_KEY } from '@/config/api';

export function useApi() {
    function saveToken(token) {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }

    function readToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    function getAuthHeaders() {
        const token = readToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }

    async function sendJsonRequest(url, method = 'GET', body = null, extraHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...extraHeaders,
        };
        const options = { method, headers };
        if (body !== null) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            const text = await response.text();
            let data;
            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = text;
            }
            return { ok: response.ok, status: response.status, data };
        } catch (error) {
            console.error('API request failed:', error);
            return { ok: false, status: 0, data: { message: 'Network error' } };
        }
    }

    return {
        saveToken,
        readToken,
        getAuthHeaders,
        sendJsonRequest,
        API_BASE,
    };
}

