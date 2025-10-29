"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAddIncidency } from "@/hooks/use-liquidations";

interface IncidencyFormProps {
  liquidationId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function IncidencyForm({
  liquidationId,
  onSuccess,
  onCancel,
}: IncidencyFormProps) {
  const addIncidency = useAddIncidency(liquidationId);
  const [formData, setFormData] = useState({
    reason: "",
    amount: "",
    incidencyDate:
      new Date().toISOString().split("T")[0] +
      "T" +
      new Date().toTimeString().slice(0, 5),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      reason: formData.reason,
      amount: formData.amount ? parseFloat(formData.amount) : undefined,
      incidencyDate: formData.incidencyDate,
    };

    addIncidency.mutate(
      {
        params: { path: { liquidationId } },
        body: payload,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

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
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
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
              onChange={(e) =>
                setFormData({ ...formData, incidencyDate: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={addIncidency.isPending}>
              {addIncidency.isPending ? "Agregando..." : "Agregar Incidencia"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
