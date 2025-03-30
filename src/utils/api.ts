import { API_BASE_URL } from '../constants/config';

interface ApiResponse<T> {
    data: T;
    error?: string;
}

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        return {
            data: null as T,
            error: error instanceof Error ? error.message : 'An unknown error occurred',
        };
    }
} 