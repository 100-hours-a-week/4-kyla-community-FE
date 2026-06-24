export const getServerUrl = () => {
    const configUrl =
        typeof window !== 'undefined' &&
        window.__APP_CONFIG__ &&
        window.__APP_CONFIG__.API_BASE_URL
            ? String(window.__APP_CONFIG__.API_BASE_URL).trim()
            : '';

    if (configUrl) {
        return configUrl.replace(/\/+$/, '');
    }

    const host = window.location.hostname;
    return host.includes('localhost')
        ? 'http://localhost:8080'
        : `http://${host}:8080`;
};

export const saveAuthData = data => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', String(data.userId));
};

export const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
};

export const resolveImageUrl = (url, fallback = null) => {
    if (!url) return fallback;
    if (/^https?:\/\//i.test(url)) return url;
    const path = url.startsWith('/') ? url : `/${url}`;

    if (path.startsWith('/uploads/')) {
        return `${getServerUrl()}/v1${path}`;
    }

    return `${getServerUrl()}${path}`;
};

export const serverSessionCheck = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    if (!accessToken || !userId) {
        return new Response(
            JSON.stringify({
                success: false,
                status: 401,
                message: '로그인이 필요합니다.',
                data: null,
            }),
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            },
        );
    }

    return fetch(`${getServerUrl()}/v1/users/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const authCheck = async () => {
    const HTTP_OK = 200;
    const response = await serverSessionCheck();
    if (!response || response.status !== HTTP_OK) {
        clearAuthData();
        location.href = '/html/login.html';
    }
    return response;
};

export const authCheckReverse = async () => {
    if (
        !localStorage.getItem('accessToken') ||
        !localStorage.getItem('userId')
    ) {
        return;
    }

    try {
        const response = await serverSessionCheck();
        if (response && response.ok) {
            location.href = '/';
            return;
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
    }
    clearAuthData();
};
// 이메일 유효성 검사
export const validEmail = email => {
    const REGEX =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    return REGEX.test(email);
};

export const validPassword = password => {
    const REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return REGEX.test(password);
};

export const validNickname = nickname => {
    const REGEX = /^[가-힣a-zA-Z0-9]{2,10}$/;
    return REGEX.test(nickname);
};

export const prependChild = (parent, child) => {
    parent.insertBefore(child, parent.firstChild);
};

/**
 *
 * @param {File} file  이미지 파일
 * @param {boolean} isHigh? : true면 origin, false면  1/4 사이즈
 * @returns
 */
export const fileToBase64 = (file, isHigh) => {
    return new Promise((resolve, reject) => {
        const size = isHigh ? 1 : 4;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                const width = img.width / size;
                const height = img.height / size;
                const elem = document.createElement('canvas');
                elem.width = width;
                elem.height = height;
                const ctx = elem.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(ctx.canvas.toDataURL());
            };
            img.onerror = e => {
                reject(e);
            };
        };
        reader.onerror = e => {
            reject(e);
        };
    });
};

/**
 *
 * @param {string} param
 * @returns
 */
export const getQueryString = param => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
};

export const padTo2Digits = number => {
    return number.toString().padStart(2, '0');
};
