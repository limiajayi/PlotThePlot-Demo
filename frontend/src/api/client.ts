const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// api client for a safe way of searching
export const createApiClient = (token: string | undefined) => {

    // new, safer way of querying the backend
    const apiFetch = async (path: string, options: RequestInit = {}) => {
        const response = await fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}`} : {}),
                ...options.headers,
            }
        });

        if (!response.ok) throw new Error (`API error: ${response.status}`);
        return response.json();
    }

    return { apiFetch }
};