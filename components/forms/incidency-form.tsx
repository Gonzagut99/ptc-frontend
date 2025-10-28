"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface IncidencyFormProps {
  liquidationId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function IncidencyForm({ liquidationId, onSuccess, onCancel }: IncidencyFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reason: "",
    amount: "",
    incidencyDate: new Date().toISOString().split("T")[0] + "T" + new Date().toTimeString().slice(0, 5),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Adding incidency to liquidation:", liquidationId, formData)
      onSuccess?.()
    } catch (error) {
      console.error("Error adding incidency:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Incidencia</CardTitle>
        <CardDescription>Liquidación #{liquidationId}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Textarea
              id="reason"
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Describa la incidencia..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Monto (opcional)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="incidencyDate">Fecha de Incidencia *</Label>
            <Input
              id="incidencyDate"
              type="datetime-local"
              required
              value={formData.incidencyDate}
              onChange={(e) => setFormData({ ...formData, incidencyDate: e.target.value })}
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Agregando..." : "Agregar Incidencia"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
