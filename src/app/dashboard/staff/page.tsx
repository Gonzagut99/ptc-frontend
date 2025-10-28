"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { useStaff } from "@/hooks/use-staff"
import type { DStaff } from "@/lib/api-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { StaffForm } from "@/components/forms/staff-form"
import { Plus } from "lucide-react"

const roleColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUPERADMIN: "destructive",
  SALES: "default",
  COUNTER: "secondary",
  ACCOUNTING: "outline",
  OPERATIONS: "default",
  SUPPORT: "secondary",
}

const columns: ColumnDef<DStaff>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "user.userName",
    header: "Usuario",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => <Badge variant={roleColors[row.original.role || ""] || "default"}>{row.original.role}</Badge>,
  },
  {
    accessorKey: "phoneNumber",
    header: "Teléfono",
  },
  {
    accessorKey: "salary",
    header: "Salario",
    cell: ({ row }) => {
      const salary = row.original.salary
      const currency = row.original.currency
      return salary ? `${currency} ${salary.toFixed(2)}` : "-"
    },
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
]

export default function StaffPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { query, setPagination } = useStaff()

  const { data: response, isLoading, isError, error } = query

  const data = response?.content || []
  const pageMetadata = response?.page
  const totalPages = pageMetadata?.totalPages || 0
  const totalElements = pageMetadata?.totalElements || 0
  const pageIndex = pageMetadata?.number || 0
  const pageSize = pageMetadata?.size || 10

  const handleSuccess = () => {
    setDialogOpen(false)
  }

  const handlePageChange = (newPageIndex: number) => {
    setPagination(newPageIndex, pageSize)
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive">Error al cargar personal</h2>
            <p className="text-muted-foreground mt-2">{error?.message || 'Ocurrió un error inesperado'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Personal</h1>
          <p className="text-muted-foreground mt-2">Gestión del personal de la agencia</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Personal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Personal</DialogTitle>
            </DialogHeader>
            <StaffForm onSuccess={handleSuccess} />
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
  )
}
