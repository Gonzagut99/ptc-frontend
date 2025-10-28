"use client";

import { useQueryClient } from "@tanstack/react-query";
import { backend } from "@/lib/backend";
import { usePagination } from "./use-pagination";
import { toast } from "sonner";

/**
 * Hook para obtener usuarios paginados
 */
export function useUsers() {
  const { page, size, setPagination, resetPagination } = usePagination();

  const query = backend.useQuery("get", "/users/paginados", {
    params: {
      query: {
        page: page,
        size: size,
      } as unknown as {
        requestDto: {
          page: number;
          size: number;
        };
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
 * Hook para obtener un usuario por ID
 */
export function useUserById(id: number) {
  return backend.useQuery("get", "/users/{id}", {
    params: {
      path: { id },
    },
  });
}

/**
 * Hook para crear un nuevo usuario
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/users", {
    onSuccess: () => {
      // Invalidar la query de usuarios paginados para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["get", "/users/paginados"] });
      toast.success("Usuario creado correctamente");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Ocurrió un error al crear el usuario";
      toast.error(errorMessage);
    },
  });
}
