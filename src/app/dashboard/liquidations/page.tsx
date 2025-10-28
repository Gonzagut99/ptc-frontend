"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { useLiquidations } from "@/hooks/use-liquidations"
import type { LiquidationWithDetailsDto } from "@/lib/api-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LiquidationForm } from "@/components/forms/liquidation-form"
import { Plus } from "lucide-react"
import { LiquidationDetailsDialog } from "@/components/liquidation-details-dialog"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  IN_QUOTE: "secondary",
  PENDING: "outline",
  ON_COURSE: "default",
  COMPLETED: "default",
}

const paymentStatusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  PENDING: "destructive",
  ON_COURSE: "outline",
  COMPLETED: "default",
}

export default function LiquidationsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLiquidation, setSelectedLiquidation] = useState<LiquidationWithDetailsDto | null>(null)
  const { query, setPagination } = useLiquidations()

  const { data: response, isLoading, isError, error, refetch } = query

  const data = response?.content || []
  const pageMetadata = response?.page
  const totalPages = pageMetadata?.totalPages || 0
  const totalElements = pageMetadata?.totalElements || 0
  const pageIndex = pageMetadata?.number || 0
  const pageSize = pageMetadata?.size || 10

  const columns: ColumnDef<LiquidationWithDetailsDto>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "customer",
      header: "Cliente",
      cell: ({ row }) => {
        const customer = row.original.customer
        return customer ? `${customer.firstName} ${customer.lastName}` : "-"
      },
    },
    {
      accessorKey: "staff_on_charge",
      header: "Personal",
      cell: ({ row }) => {
        const staff = row.original.staff_on_charge
        return staff?.user?.userName || "-"
      },
    },
    {
      accessorKey: "total_amount",
      header: "Monto Total",
      cell: ({ row }) => {
        const amount = row.original.total_amount
        return amount ? `$${amount.toFixed(2)}` : "-"
      },
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={statusColors[row.original.status || ""] || "default"}>{row.original.status}</Badge>
      ),
    },
    {
      accessorKey: "payment_status",
      header: "Estado Pago",
      cell: ({ row }) => (
        <Badge variant={paymentStatusColors[row.original.payment_status || ""] || "default"}>
          {row.original.payment_status}
        </Badge>
      ),
    },
    {
      accessorKey: "payment_deadline",
      header: "Fecha Límite",
      cell: ({ row }) => {
        const date = row.original.payment_deadline
        return date ? new Date(date).toLocaleDateString("es-PE") : "-"
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => setSelectedLiquidation(row.original)}>
          Ver Detalles
        </Button>
      ),
    },
  ]

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
            <h2 className="text-2xl font-bold text-destructive">Error al cargar liquidaciones</h2>
            <p className="text-muted-foreground mt-2">{(error as any)?.message || 'Ocurrió un error inesperado'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Liquidaciones</h1>
          <p className="text-muted-foreground mt-2">Gestión de liquidaciones y servicios</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Crear Liquidación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-5rem)] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Liquidación</DialogTitle>
            </DialogHeader>
            <LiquidationForm onSuccess={handleSuccess} />
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

      {selectedLiquidation && (
        <LiquidationDetailsDialog
          liquidation={selectedLiquidation}
          open={!!selectedLiquidation}
          onOpenChange={(open) => !open && setSelectedLiquidation(null)}
          onUpdate={() => refetch()}
        />
      )}
    </div>
  )
}
