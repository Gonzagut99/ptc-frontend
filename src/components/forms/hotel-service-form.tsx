"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"

interface HotelServiceFormProps {
  liquidationId: number
  onSuccess?: () => void
  onCancel?: () => void
}

interface HotelBooking {
  check_in: string
  check_out: string
  hotel: string
  room: string
  room_description: string
  price_by_night: string
  currency: string
  status: string
}

export function HotelServiceForm({ liquidationId, onSuccess, onCancel }: HotelServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tariff_rate: "0.00",
    is_taxed: true,
    currency: "PEN",
  })
  const [bookings, setBookings] = useState<HotelBooking[]>([
    {
      check_in: "",
      check_out: "",
      hotel: "",
      room: "",
      room_description: "",
      price_by_night: "",
      currency: "PEN",
      status: "PENDING",
    },
  ])

  const addBooking = () => {
    setBookings([
      ...bookings,
      {
        check_in: "",
        check_out: "",
        hotel: "",
        room: "",
        room_description: "",
        price_by_night: "",
        currency: "PEN",
        status: "PENDING",
      },
    ])
  }

  const removeBooking = (index: number) => {
    setBookings(bookings.filter((_, i) => i !== index))
  }

  const updateBooking = (index: number, field: keyof HotelBooking, value: string) => {
    const newBookings = [...bookings]
    newBookings[index] = { ...newBookings[index], [field]: value }
    setBookings(newBookings)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Adding hotel service to liquidation:", liquidationId, { ...formData, hotel_bookings: bookings })
      onSuccess?.()
    } catch (error) {
      console.error("Error adding hotel service:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Servicio de Hotel</CardTitle>
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
              <Label className="text-base font-semibold">Reservas de Hotel</Label>
              <Button type="button" size="sm" onClick={addBooking}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar Reserva
              </Button>
            </div>

            {bookings.map((booking, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Reserva {index + 1}</h4>
                    {bookings.length > 1 && (
                      <Button type="button" size="sm" variant="destructive" onClick={() => removeBooking(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Check-in *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.check_in}
                        onChange={(e) => updateBooking(index, "check_in", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Check-out *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.check_out}
                        onChange={(e) => updateBooking(index, "check_out", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hotel *</Label>
                      <Input
                        required
                        value={booking.hotel}
                        onChange={(e) => updateBooking(index, "hotel", e.target.value)}
                        placeholder="Hotel Costa del Sol"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Habitación *</Label>
                      <Input
                        required
                        value={booking.room}
                        onChange={(e) => updateBooking(index, "room", e.target.value)}
                        placeholder="Suite Deluxe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Descripción de Habitación</Label>
                    <Textarea
                      value={booking.room_description}
                      onChange={(e) => updateBooking(index, "room_description", e.target.value)}
                      placeholder="Habitación con vista al mar, cama king size..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Precio por Noche *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={booking.price_by_night}
                        onChange={(e) => updateBooking(index, "price_by_night", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Moneda *</Label>
                      <Select
                        value={booking.currency}
                        onValueChange={(value) => updateBooking(index, "currency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PEN">PEN</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Estado *</Label>
                      <Select value={booking.status} onValueChange={(value) => updateBooking(index, "status", value)}>
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
