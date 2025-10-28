"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { useCustomers } from "@/hooks/use-customers"
import type { DCustomer } from "@/lib/api-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CustomerForm } from "@/components/forms/customer-form"
import { Plus } from "lucide-react"

const columns: ColumnDef<DCustomer>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "firstName",
    header: "Nombre",
    cell: ({ row }) => {
      return `${row.original.firstName} ${row.original.lastName}`
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNumber",
    header: "Teléfono",
  },
  {
    accessorKey: "idDocumentType",
    header: "Tipo Doc.",
    cell: ({ row }) => <Badge variant="outline">{row.original.idDocumentType}</Badge>,
  },
  {
    accessorKey: "idDocumentNumber",
    header: "Nro. Documento",
  },
  {
    accessorKey: "nationality",
    header: "Nacionalidad",
  },
]

export default function CustomersPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { query, setPagination } = useCustomers()

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
            <h2 className="text-2xl font-bold text-destructive">Error al cargar clientes</h2>
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-2">Gestión de clientes de la agencia</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <CustomerForm onSuccess={handleSuccess} />
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
