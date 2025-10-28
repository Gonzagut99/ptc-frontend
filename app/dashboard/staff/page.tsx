"use client"

import { useState, useEffect } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { fetchStaff } from "@/lib/api-client"
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
  const [data, setData] = useState<DStaff[]>([])
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
    const response = await fetchStaff(pageIndex, pageSize)
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
        onPageChange={setPageIndex}
        loading={loading}
      />
    </div>
  )
}
