"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface TourServiceFormProps {
  liquidationId: number
  onSuccess?: () => void
  onCancel?: () => void
}

interface Tour {
  start_date: string
  end_date: string
  title: string
  price: string
  place: string
  currency: string
  status: string
}

export function TourServiceForm({ liquidationId, onSuccess, onCancel }: TourServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tariff_rate: "0.00",
    is_taxed: true,
    currency: "PEN",
  })
  const [tours, setTours] = useState<Tour[]>([
    {
      start_date: "",
      end_date: "",
      title: "",
      price: "",
      place: "",
      currency: "PEN",
      status: "PENDING",
    },
  ])

  const addTour = () => {
    setTours([
      ...tours,
      {
        start_date: "",
        end_date: "",
        title: "",
        price: "",
        place: "",
        currency: "PEN",
        status: "PENDING",
      },
    ])
  }

  const removeTour = (index: number) => {
    setTours(tours.filter((_, i) => i !== index))
  }

  const updateTour = (index: number, field: keyof Tour, value: string) => {
    const newTours = [...tours]
    newTours[index] = { ...newTours[index], [field]: value }
    setTours(newTours)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Adding tour service to liquidation:", liquidationId, { ...formData, tours })
      onSuccess?.()
    } catch (error) {
      console.error("Error adding tour service:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Servicio de Tour</CardTitle>
        <CardDescription>Liquidación #{liquidationId}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tariff_rate">Tarifa *</Label>
              <Input
                id="tariff_rate"
                type="number"
                step="0.01"
                required
                value={formData.tariff_rate}
                onChange={(e) => setFormData({ ...formData, tariff_rate: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda *</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PEN">PEN (S/)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_taxed">¿Incluye IGV?</Label>
              <Select
                value={formData.is_taxed ? "true" : "false"}
                onValueChange={(value) => setFormData({ ...formData, is_taxed: value === "true" })}
              >
                <SelectTrigger id="is_taxed">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sí</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Tours</Label>
              <Button type="button" size="sm" onClick={addTour}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar Tour
              </Button>
            </div>

            {tours.map((tour, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Tour {index + 1}</h4>
                    {tours.length > 1 && (
                      <Button type="button" size="sm" variant="destructive" onClick={() => removeTour(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha Inicio *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={tour.start_date}
                        onChange={(e) => updateTour(index, "start_date", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Fin *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={tour.end_date}
                        onChange={(e) => updateTour(index, "end_date", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Título *</Label>
                    <Input
                      required
                      value={tour.title}
                      onChange={(e) => updateTour(index, "title", e.target.value)}
                      placeholder="Tour a Machu Picchu"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Lugar *</Label>
                      <Input
                        required
                        value={tour.place}
                        onChange={(e) => updateTour(index, "place", e.target.value)}
                        placeholder="Cusco"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Precio *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={tour.price}
                        onChange={(e) => updateTour(index, "price", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Moneda *</Label>
                      <Select value={tour.currency} onValueChange={(value) => updateTour(index, "currency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PEN">PEN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Estado *</Label>
                    <Select value={tour.status} onValueChange={(value) => updateTour(index, "status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pendiente</SelectItem>
                        <SelectItem value="COMPLETED">Completado</SelectItem>
                        <SelectItem value="CANCELED">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Agregando..." : "Agregar Servicio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
