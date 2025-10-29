"use client";

import { useQueryClient } from "@tanstack/react-query";
import { backend } from "@/lib/backend";
import { usePagination } from "./use-pagination";
import { toast } from "sonner";

/**
 * Hook para obtener liquidaciones paginadas
 */
export function useLiquidations() {
  const { page, size, setPagination, resetPagination } = usePagination();

  console.log("useLiquidations - page:", page, "size:", size);

  const query = backend.useQuery("get", "/liquidations/paginated", {
    params: {
      query: {
        requestDto: { page, size },
      },
    },
  });

  console.log("Query data:", query.data);

  return {
    query,
    setPagination,
    resetPagination,
    page,
    size,
  };
}

/**
 * Hook para obtener una liquidación por ID con todos sus detalles
 */
export function useLiquidationById(
  liquidationId: number,
  enabled: boolean = true
) {
  return backend.useQuery(
    "get",
    "/liquidations/{liquidationId}",
    {
      params: {
        path: { liquidationId },
      },
    },
    {
      enabled: enabled && liquidationId > 0,
    }
  );
}

/**
 * Hook para crear una nueva liquidación
 */
export function useCreateLiquidation() {
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/liquidations", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/liquidations/paginated"],
      });
      toast.success("Liquidación creada correctamente");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Ocurrió un error al crear la liquidación";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para agregar servicio de tour a una liquidación
 */
export function useAddTourService(liquidationId: number) {
  const queryClient = useQueryClient();

  return backend.useMutation(
    "post",
    "/liquidations/{liquidationId}/tour-services",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/paginated"],
        });
        toast.success("Servicio de tour agregado correctamente");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.message || "Ocurrió un error al agregar el servicio de tour";
        toast.error(errorMessage);
      },
    }
  );
}

/**
 * Hook para agregar servicio de hotel a una liquidación
 */
export function useAddHotelService(liquidationId: number) {
  const queryClient = useQueryClient();

  return backend.useMutation(
    "post",
    "/liquidations/{liquidationId}/hotel-services",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/paginated"],
        });
        toast.success("Servicio de hotel agregado correctamente");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.message || "Ocurrió un error al agregar el servicio de hotel";
        toast.error(errorMessage);
      },
    }
  );
}

/**
 * Hook para agregar servicio de vuelo a una liquidación
 */
export function useAddFlightService(liquidationId: number) {
  const queryClient = useQueryClient();

  return backend.useMutation(
    "post",
    "/liquidations/{liquidationId}/flight-services",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/paginated"],
        });
        toast.success("Servicio de vuelo agregado correctamente");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.message || "Ocurrió un error al agregar el servicio de vuelo";
        toast.error(errorMessage);
      },
    }
  );
}

/**
 * Hook para agregar servicio adicional a una liquidación
 */
export function useAddAdditionalService(liquidationId: number) {
  const queryClient = useQueryClient();

  return backend.useMutation(
    "post",
    "/liquidations/{liquidationId}/additional-services",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/paginated"],
        });
        toast.success("Servicio adicional agregado correctamente");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.message || "Ocurrió un error al agregar el servicio adicional";
        toast.error(errorMessage);
      },
    }
  );
}

/**
 * Hook para agregar pago a una liquidación
 */
export function useAddPayment(liquidationId: number) {
  const queryClient = useQueryClient();

  return backend.useMutation("post", "/liquidations/{liquidationId}/payments", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["get", "/liquidations/paginated"],
      });
      toast.success("Pago registrado correctamente");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Ocurrió un error al registrar el pago";
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook para agregar incidencia a una liquidación
 */
export function useAddIncidency(liquidationId: number) {
  const queryClient = useQueryClient();

  return backend.useMutation(
    "post",
    "/liquidations/{liquidationId}/incidencies",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/{liquidationId}", { liquidationId }],
        });
        queryClient.invalidateQueries({
          queryKey: ["get", "/liquidations/paginated"],
        });
        toast.success("Incidencia reportada correctamente");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.message || "Ocurrió un error al reportar la incidencia";
        toast.error(errorMessage);
      },
    }
  );
}
