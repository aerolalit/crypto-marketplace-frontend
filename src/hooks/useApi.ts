import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '../constants/config';

interface ApiResponse<T> {
    data: T;
    error?: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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

export function useApiQuery<T>(endpoint: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [endpoint],
        queryFn: () => fetchApi<T>(endpoint).then(res => res.data),
        ...options,
    });
}

export function useApiMutation<T, V = void>(endpoint: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: V) => fetchApi<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(variables),
        }).then(res => res.data),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: [endpoint] });
        },
    });
} 