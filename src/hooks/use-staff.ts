"use client";

import { useQueryClient } from "@tanstack/react-query";
import { backend } from "@/lib/backend";
import { usePagination } from "./use-pagination";
import { toast } from "sonner";

/**
 * Hook para obtener staff paginado
 */
export function useStaff() {
  const { page, size, setPagination, resetPagination } = usePagination();

  const query = backend.useQuery("get", "/staff/paginados", {
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
 * Hook para obtener un staff por ID
 */
export function useStaffById(id: number) {
  return backend.useQuery("get", "/staff/{id}", {
    params: {
      path: { id },
    },
  });
}

/**
 * Hook para obtener staff por rol
 */
export function useStaffByRole(role: string) {
  return backend.useQuery("get", "/staff/by-role/{role}", {
    params: {
      path: { role },
    },
  });
}

/**
 * Hook para crear un nuevo staff (requiere userId existente)
 */
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/staff", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "/staff/paginados"] });
      toast.success("Miembro del personal creado correctamente");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Ocurrió un error al crear el staff";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para crear un usuario con staff en una sola operación
 */
export function useCreateUserWithStaff() {
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/staff/with-user", {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get", "/staff/paginados"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/users/paginados"] });
      toast.success("Usuario y perfil de staff creados correctamente");
    },
    onError: (error) => {
      const errorMessage =
        error?.message || "Ocurrió un error al crear el usuario con staff";
      toast.error(errorMessage);
    },
  });
}
