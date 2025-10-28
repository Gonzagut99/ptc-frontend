"use client";

import { useQueryClient } from "@tanstack/react-query";
import { backend } from "@/lib/backend";
import { usePagination } from "./use-pagination";
import { toast } from "sonner";

/**
 * Hook para obtener clientes paginados
 */
export function useCustomers() {
  const { page, size, setPagination, resetPagination } = usePagination();

  const query = backend.useQuery("get", "/clientes/paginados", {
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
 * Hook para crear un nuevo cliente
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/clientes", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/clientes/paginados"],
      });
      toast.success("Cliente creado correctamente");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Ocurrió un error al crear el cliente";
      toast.error(errorMessage);
    },
  });
}
