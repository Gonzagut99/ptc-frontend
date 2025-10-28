"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LiquidationWithDetailsDto } from "@/lib/api-types"
import { TourServiceForm } from "@/components/forms/tour-service-form"
import { HotelServiceForm } from "@/components/forms/hotel-service-form"
import { FlightServiceForm } from "@/components/forms/flight-service-form"
import { AdditionalServiceForm } from "@/components/forms/additional-service-form"
import { PaymentForm } from "@/components/forms/payment-form"
import { IncidencyForm } from "@/components/forms/incidency-form"
import { Plane, Hotel, MapPin, Package, CreditCard, AlertTriangle, ArrowRight } from "lucide-react"

interface LiquidationDetailsDialogProps {
  liquidation: LiquidationWithDetailsDto
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

export function LiquidationDetailsDialog({ liquidation, open, onOpenChange, onUpdate }: LiquidationDetailsDialogProps) {
  const [activeServiceForm, setActiveServiceForm] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showIncidencyForm, setShowIncidencyForm] = useState(false)

  const handleServiceSuccess = () => {
    setActiveServiceForm(null)
    onUpdate()
  }

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false)
    onUpdate()
  }

  const handleIncidencySuccess = () => {
    setShowIncidencyForm(false)
    onUpdate()
  }

  const handleStatusTransition = async (newStatus: string) => {
    // TODO: Implement API call to update liquidation status
    console.log("[v0] Transitioning liquidation status to:", newStatus)
    onUpdate()
  }

  const getNextStatus = () => {
    switch (liquidation.status) {
      case "IN_QUOTE":
        return "PENDING"
      case "PENDING":
        return "ON_COURSE"
      case "ON_COURSE":
        return "COMPLETED"
      default:
        return null
    }
  }

  const nextStatus = getNextStatus()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-5rem)] max-w-[calc(100vw-5rem)] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Liquidación #{liquidation.id}</span>
            <div className="flex items-center gap-2">
              <Badge>{liquidation.status}</Badge>
              <Badge variant="outline">{liquidation.payment_status}</Badge>
              {nextStatus && (
                <Button size="sm" onClick={() => handleStatusTransition(nextStatus)}>
                  Cambiar a {nextStatus}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>Gestiona los servicios, pagos e incidencias de esta liquidación</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer and Staff Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {liquidation.customer?.firstName} {liquidation.customer?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{liquidation.customer?.email}</p>
                <p className="text-sm text-muted-foreground">{liquidation.customer?.phoneNumber}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Personal a Cargo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{liquidation.staff_on_charge?.user?.userName}</p>
                <p className="text-sm text-muted-foreground">{liquidation.staff_on_charge?.user?.email}</p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Resumen Financiero</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monto Total</p>
                <p className="text-2xl font-bold">${liquidation.total_amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagado</p>
                <p className="text-2xl font-bold text-green-600">${liquidation.paid_amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendiente</p>
                <p className="text-2xl font-bold text-red-600">${liquidation.pending_amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fecha Límite</p>
                <p className="text-lg font-medium">
                  {liquidation.payment_deadline
                    ? new Date(liquidation.payment_deadline).toLocaleDateString("es-PE")
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Services and Details Tabs */}
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="services">Servicios</TabsTrigger>
              <TabsTrigger value="payments">Pagos</TabsTrigger>
              <TabsTrigger value="incidencies">Incidencias</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setActiveServiceForm("tour")}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Agregar Tour
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveServiceForm("hotel")}>
                  <Hotel className="mr-2 h-4 w-4" />
                  Agregar Hotel
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveServiceForm("flight")}>
                  <Plane className="mr-2 h-4 w-4" />
                  Agregar Vuelo
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveServiceForm("additional")}>
                  <Package className="mr-2 h-4 w-4" />
                  Agregar Servicio
                </Button>
              </div>

              {activeServiceForm === "tour" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nuevo Tour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TourServiceForm liquidationId={liquidation.id!} onSuccess={handleServiceSuccess} />
                  </CardContent>
                </Card>
              )}

              {activeServiceForm === "hotel" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nuevo Hotel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HotelServiceForm liquidationId={liquidation.id!} onSuccess={handleServiceSuccess} />
                  </CardContent>
                </Card>
              )}

              {activeServiceForm === "flight" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nuevo Vuelo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FlightServiceForm liquidationId={liquidation.id!} onSuccess={handleServiceSuccess} />
                  </CardContent>
                </Card>
              )}

              {activeServiceForm === "additional" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nuevo Servicio Adicional</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AdditionalServiceForm liquidationId={liquidation.id!} onSuccess={handleServiceSuccess} />
                  </CardContent>
                </Card>
              )}

              {/* Display existing services */}
              <div className="space-y-2">
                {liquidation.tours?.map((tour) => (
                  <Card key={tour.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{tour.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {tour.destination} - {tour.duration}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">${tour.price?.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {liquidation.hotels?.map((hotel) => (
                  <Card key={hotel.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Hotel className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{hotel.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {hotel.location} - {hotel.nights} noches
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">${hotel.price?.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {liquidation.flights?.map((flight) => (
                  <Card key={flight.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Plane className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">
                              {flight.origin} → {flight.destination}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {flight.airline} - {flight.flightNumber}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold">${flight.price?.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {liquidation.additionalServices?.map((service) => (
                  <Card key={service.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Package className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <p className="font-bold">${service.price?.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Button size="sm" onClick={() => setShowPaymentForm(true)}>
                <CreditCard className="mr-2 h-4 w-4" />
                Registrar Pago
              </Button>

              {showPaymentForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nuevo Pago</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PaymentForm liquidationId={liquidation.id!} onSuccess={handlePaymentSuccess} />
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {liquidation.payments?.map((payment) => (
                  <Card key={payment.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">${payment.amount?.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("es-PE") : "-"} -{" "}
                            {payment.paymentMethod}
                          </p>
                        </div>
                        <Badge>{payment.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="incidencies" className="space-y-4">
              <Button size="sm" variant="outline" onClick={() => setShowIncidencyForm(true)}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Reportar Incidencia
              </Button>

              {showIncidencyForm && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nueva Incidencia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <IncidencyForm liquidationId={liquidation.id!} onSuccess={handleIncidencySuccess} />
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                {liquidation.incidencies?.map((incidency) => (
                  <Card key={incidency.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{incidency.title}</p>
                          <p className="text-sm text-muted-foreground">{incidency.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {incidency.reportedDate
                              ? new Date(incidency.reportedDate).toLocaleDateString("es-PE")
                              : "-"}
                          </p>
                        </div>
                        <Badge variant={incidency.status === "RESOLVED" ? "default" : "destructive"}>
                          {incidency.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
