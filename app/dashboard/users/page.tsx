"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { fetchUsers } from "@/lib/api-client"
import type { DUser } from "@/lib/api-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserForm } from "@/components/forms/user-form"
import { Plus } from "lucide-react"

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
      const date = row.original.createdDate
      return date ? new Date(date).toLocaleDateString("es-PE") : "-"
    },
  },
]

export default function UsersPage() {
  const [data, setData] = useState<DUser[]>([])
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
    const response = await fetchUsers(pageIndex, pageSize)
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Usuarios</h1>
          <p className="text-muted-foreground mt-2">Gestión de usuarios del sistema</p>
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
        onPageChange={setPageIndex}
        loading={loading}
      />
    </div>
  )
}
