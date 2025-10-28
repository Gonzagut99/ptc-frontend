"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomers, getStaff } from "@/lib/api-client"
import type { DCustomer, DStaff } from "@/lib/api-types"

interface LiquidationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function LiquidationForm({ onSuccess, onCancel }: LiquidationFormProps) {
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<DCustomer[]>([])
  const [staff, setStaff] = useState<DStaff[]>([])
  const [formData, setFormData] = useState({
    customer_id: "",
    staff_id: "",
    currency_rate: "3.75",
    payment_deadline: "",
    companion: "1",
  })

  useEffect(() => {
    const loadData = async () => {
      const [customersData, staffData] = await Promise.all([getCustomers(0, 100), getStaff(0, 100)])
      setCustomers(customersData.content || [])
      setStaff(staffData.content || [])
    }
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Creating liquidation:", formData)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating liquidation:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Liquidación</CardTitle>
        <CardDescription>Ingrese los datos de la nueva liquidación</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_id">Cliente *</Label>
            <Select
              value={formData.customer_id}
              onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
            >
              <SelectTrigger id="customer_id">
                <SelectValue placeholder="Seleccione un cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={String(customer.id)}>
                    {customer.firstName} {customer.lastName} - {customer.idDocumentNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staff_id">Personal a Cargo *</Label>
            <Select value={formData.staff_id} onValueChange={(value) => setFormData({ ...formData, staff_id: value })}>
              <SelectTrigger id="staff_id">
                <SelectValue placeholder="Seleccione personal" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.user?.userName || s.user?.email} - {s.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency_rate">Tipo de Cambio *</Label>
              <Input
                id="currency_rate"
                type="number"
                step="0.01"
                required
                value={formData.currency_rate}
                onChange={(e) => setFormData({ ...formData, currency_rate: e.target.value })}
                placeholder="3.75"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companion">Acompañantes *</Label>
              <Input
                id="companion"
                type="number"
                min="1"
                required
                value={formData.companion}
                onChange={(e) => setFormData({ ...formData, companion: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_deadline">Fecha Límite de Pago *</Label>
            <Input
              id="payment_deadline"
              type="datetime-local"
              required
              value={formData.payment_deadline}
              onChange={(e) => setFormData({ ...formData, payment_deadline: e.target.value })}
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading || !formData.customer_id || !formData.staff_id}>
              {loading ? "Creando..." : "Crear Liquidación"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
