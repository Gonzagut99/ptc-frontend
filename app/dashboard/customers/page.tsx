"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { fetchCustomers } from "@/lib/api-client"
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
  const [data, setData] = useState<DCustomer[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [pageIndex])

  const loadData = async () => {
    setLoading(true)
    const response = await fetchCustomers(pageIndex, pageSize)
    setData(response.content || [])
    setTotalPages(response.page?.totalPages || 0)
    setTotalElements(response.page?.totalElements || 0)
    setLoading(false)
  }

  const handleSuccess = () => {
    setDialogOpen(false)
    loadData()
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
        onPageChange={setPageIndex}
        loading={loading}
      />
    </div>
  )
}
