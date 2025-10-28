"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { useAddFlightService } from "@/hooks/use-liquidations"

interface FlightServiceFormProps {
  liquidationId: number
  onSuccess?: () => void
  onCancel?: () => void
}

interface FlightBooking {
  origin: string
  destiny: string
  departure_date: string
  arrival_date: string
  aeroline: string
  aeroline_booking_code: string
  costamar_booking_code: string
  tkt_numbers: string
  status: string
  total_price: string
  currency: string
}

export function FlightServiceForm({ liquidationId, onSuccess, onCancel }: FlightServiceFormProps) {
  const addFlightService = useAddFlightService(liquidationId)
  const [formData, setFormData] = useState({
    tariff_rate: "0.00",
    is_taxed: true,
    currency: "PEN",
  })
  const [bookings, setBookings] = useState<FlightBooking[]>([
    {
      origin: "",
      destiny: "",
      departure_date: "",
      arrival_date: "",
      aeroline: "",
      aeroline_booking_code: "",
      costamar_booking_code: "",
      tkt_numbers: "",
      status: "PENDING",
      total_price: "",
      currency: "PEN",
    },
  ])

  const addBooking = () => {
    setBookings([
      ...bookings,
      {
        origin: "",
        destiny: "",
        departure_date: "",
        arrival_date: "",
        aeroline: "",
        aeroline_booking_code: "",
        costamar_booking_code: "",
        tkt_numbers: "",
        status: "PENDING",
        total_price: "",
        currency: "PEN",
      },
    ])
  }

  const removeBooking = (index: number) => {
    setBookings(bookings.filter((_, i) => i !== index))
  }

  const updateBooking = (index: number, field: keyof FlightBooking, value: string) => {
    const newBookings = [...bookings]
    newBookings[index] = { ...newBookings[index], [field]: value }
    setBookings(newBookings)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      tariff_rate: parseFloat(formData.tariff_rate),
      is_taxed: formData.is_taxed,
      currency: formData.currency,
      flight_bookings: bookings.map(booking => ({
        origin: booking.origin,
        destiny: booking.destiny,
        departure_date: booking.departure_date,
        arrival_date: booking.arrival_date,
        aeroline: booking.aeroline,
        aeroline_booking_code: booking.aeroline_booking_code,
        costamar_booking_code: booking.costamar_booking_code,
        tkt_numbers: booking.tkt_numbers,
        status: booking.status,
        total_price: parseFloat(booking.total_price),
        currency: booking.currency,
      })),
    }

    addFlightService.mutate(
      { body: payload },
      {
        onSuccess: () => {
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Servicio de Vuelo</CardTitle>
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
              <Label className="text-base font-semibold">Reservas de Vuelo</Label>
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
                      <Label>Origen *</Label>
                      <Input
                        required
                        value={booking.origin}
                        onChange={(e) => updateBooking(index, "origin", e.target.value)}
                        placeholder="Lima (LIM)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Destino *</Label>
                      <Input
                        required
                        value={booking.destiny}
                        onChange={(e) => updateBooking(index, "destiny", e.target.value)}
                        placeholder="Cusco (CUZ)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Fecha Salida *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.departure_date}
                        onChange={(e) => updateBooking(index, "departure_date", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Fecha Llegada *</Label>
                      <Input
                        type="datetime-local"
                        required
                        value={booking.arrival_date}
                        onChange={(e) => updateBooking(index, "arrival_date", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Aerolínea *</Label>
                    <Input
                      required
                      value={booking.aeroline}
                      onChange={(e) => updateBooking(index, "aeroline", e.target.value)}
                      placeholder="LATAM Airlines"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Código Reserva Aerolínea *</Label>
                      <Input
                        required
                        value={booking.aeroline_booking_code}
                        onChange={(e) => updateBooking(index, "aeroline_booking_code", e.target.value)}
                        placeholder="ABC123"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Código Reserva Costamar</Label>
                      <Input
                        value={booking.costamar_booking_code}
                        onChange={(e) => updateBooking(index, "costamar_booking_code", e.target.value)}
                        placeholder="CST456"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Números de Ticket *</Label>
                    <Input
                      required
                      value={booking.tkt_numbers}
                      onChange={(e) => updateBooking(index, "tkt_numbers", e.target.value)}
                      placeholder="123-4567890123"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Precio Total *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        required
                        value={booking.total_price}
                        onChange={(e) => updateBooking(index, "total_price", e.target.value)}
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
            <Button type="submit" disabled={addFlightService.isPending}>
              {addFlightService.isPending ? "Agregando..." : "Agregar Servicio"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
