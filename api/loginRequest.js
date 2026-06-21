import { getServerUrl } from '../utils/function.js';
import { requestJson } from '../utils/request.js';

export const userLogin = async (email, password) => {
    const result = await requestJson(`${getServerUrl()}/v1/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
    return result;
};

export const userLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        return { ok: false, status: 0, body: null };
    }

    const result = await requestJson(`${getServerUrl()}/v1/auth`, {
        method: 'DELETE',
        skipAuth: true,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
    });
    return result;
};
