"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CustomerForm({ onSuccess, onCancel }: CustomerFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    idDocumentType: "DNI",
    idDocumentNumber: "",
    address: "",
    nationality: "Peruana",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Creating customer:", formData)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating customer:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Cliente</CardTitle>
        <CardDescription>Ingrese los datos del nuevo cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombres *</Label>
              <Input
                id="firstName"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Juan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellidos *</Label>
              <Input
                id="lastName"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Pérez García"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cliente@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+51 999 999 999"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="idDocumentType">Tipo de Documento *</Label>
              <Select
                value={formData.idDocumentType}
                onValueChange={(value) => setFormData({ ...formData, idDocumentType: value })}
              >
                <SelectTrigger id="idDocumentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                  <SelectItem value="CE">Carnet de Extranjería</SelectItem>
                  <SelectItem value="RUC">RUC</SelectItem>
                  <SelectItem value="DRIVER_LICENSE">Licencia de Conducir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="idDocumentNumber">Número de Documento *</Label>
              <Input
                id="idDocumentNumber"
                required
                value={formData.idDocumentNumber}
                onChange={(e) => setFormData({ ...formData, idDocumentNumber: e.target.value })}
                placeholder="12345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
              <Input
                id="birthDate"
                type="date"
                required
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nacionalidad</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="Peruana"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Av. Principal 123, Lima"
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Cliente"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
