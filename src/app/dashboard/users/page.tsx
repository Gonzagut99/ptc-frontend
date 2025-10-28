"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useUsers } from "@/hooks/use-users";
import type { DUser } from "@/lib/api-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/forms/user-form";
import { Plus } from "lucide-react";

const columns: ColumnDef<DUser>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userName",
    header: "Usuario",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "default" : "secondary"}>
        {row.original.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const date = row.original.createdDate;
      return date ? new Date(date).toLocaleDateString("es-PE") : "-";
    },
  },
];

export default function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { query, setPagination } = useUsers();

  const { data: response, isLoading, isError, error } = query;

  const data = response?.content || [];
  const pageMetadata = response?.page;
  const totalPages = pageMetadata?.totalPages || 0;
  const totalElements = pageMetadata?.totalElements || 0;
  const pageIndex = pageMetadata?.number || 0;
  const pageSize = pageMetadata?.size || 10;

  const handleSuccess = () => {
    setDialogOpen(false);
    // React Query will automatically refetch due to cache invalidation
  };

  const handlePageChange = (newPageIndex: number) => {
    setPagination(newPageIndex, pageSize);
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive">
              Error al cargar usuarios
            </h2>
            <p className="text-muted-foreground mt-2">
              {error?.message || "Ocurrió un error inesperado"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Usuarios
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestión de usuarios del sistema
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <UserForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <DataTable
        columns={columns}
        data={data}
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={handlePageChange}
        loading={isLoading}
      />
    </div>
  );
}
