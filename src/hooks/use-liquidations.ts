'use client';

import { useQueryClient } from '@tanstack/react-query';
import { backend } from '@/lib/backend';
import { usePagination } from './use-pagination';
import { toast } from 'sonner';

/**
 * Hook para obtener liquidaciones paginadas
 */
export function useLiquidations() {
    const { page, size, setPagination, resetPagination } = usePagination();

    const query = backend.useQuery('get', '/liquidations/paginated', {
        params: {
            query: {
                requestDto: { page, size },
            },
        },
    });

    return {
        query,
        setPagination,
        resetPagination,
    };
}

/**
 * Hook para obtener una liquidación por ID
 */
export function useLiquidationById(liquidationId: number) {
    return backend.useQuery('get', '/liquidations/{liquidationId}', {
        params: {
            path: { liquidationId },
        },
    });
}

/**
 * Hook para crear una nueva liquidación
 */
export function useCreateLiquidation() {
    const queryClient = useQueryClient();

    return backend.useMutation('post', '/liquidations', {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get', '/liquidations/paginated'] });
            toast.success('Liquidación creada correctamente');
        },
        onError: (error:any) => {
            const errorMessage = error?.message || 'Ocurrió un error al crear la liquidación';
            toast.error(errorMessage);
        },
    });
}
