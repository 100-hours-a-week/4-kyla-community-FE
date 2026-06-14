export const parseJsonSafe = async response => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
        return null;
    }
    try {
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const requestJson = async (url, options = {}) => {
    try {
        const headers = new Headers(options.headers || {});
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });
        const body = await parseJsonSafe(response);
        return {
            response,
            ok: response.ok,
            status: response.status,
            code: body && body.code ? body.code : null,
            data: body && Object.prototype.hasOwnProperty.call(body, 'data')
                ? body.data
                : null,
            body,
        };
    } catch (error) {
        console.error('API request failed:', error);
        return {
            response: null,
            ok: false,
            status: 0,
            code: null,
            data: null,
            body: null,
            error,
        };
    }
};
