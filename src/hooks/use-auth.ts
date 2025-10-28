'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook para autenticación (preparado para integración futura con backend)
 * 
 * Nota: Actualmente el backend no tiene un endpoint de autenticación implementado.
 * Este hook está preparado para cuando se agregue el endpoint /auth/login
 * 
 * Endpoints esperados:
 * - POST /auth/login - Iniciar sesión
 * - POST /auth/logout - Cerrar sesión
 * - GET /auth/me - Obtener usuario actual
 */

/**
 * Hook para login (mock temporal hasta que se implemente el endpoint)
 */
export function useLogin() {
    const queryClient = useQueryClient();

    // TODO: Reemplazar con backend.useMutation('post', '/auth/login') cuando esté disponible
    return {
        mutate: async (credentials: { username: string; password: string }, options?: any) => {
            try {
                // Mock implementation - reemplazar con llamada real al backend
                await new Promise(resolve => setTimeout(resolve, 800));
                
                // Simular respuesta exitosa
                const mockUser = {
                    id: 1,
                    username: credentials.username,
                    role: 'ADMIN',
                };

                options?.onSuccess?.(mockUser);
                toast.success('Sesión iniciada correctamente');
            } catch (error) {
                options?.onError?.(error);
                toast.error('Error al iniciar sesión');
            }
        },
        isPending: false,
    };
}

/**
 * Hook para logout (mock temporal hasta que se implemente el endpoint)
 */
export function useLogout() {
    const queryClient = useQueryClient();

    // TODO: Reemplazar con backend.useMutation('post', '/auth/logout') cuando esté disponible
    return {
        mutate: async (_, options?: any) => {
            try {
                // Mock implementation - reemplazar con llamada real al backend
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Limpiar cache de React Query
                queryClient.clear();
                
                options?.onSuccess?.();
                toast.success('Sesión cerrada correctamente');
            } catch (error) {
                options?.onError?.(error);
                toast.error('Error al cerrar sesión');
            }
        },
        isPending: false,
    };
}

/**
 * Hook para obtener el usuario actual (mock temporal hasta que se implemente el endpoint)
 */
export function useCurrentUser() {
    // TODO: Reemplazar con backend.useQuery('get', '/auth/me') cuando esté disponible
    return {
        data: null,
        isLoading: false,
        error: null,
    };
}
