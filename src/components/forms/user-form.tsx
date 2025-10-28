"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateUser } from "@/hooks/use-users"

interface UserFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function UserForm({ onSuccess, onCancel }: UserFormProps) {
  const createUser = useCreateUser()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createUser.mutate(
      {
        body: {
          email: formData.email,
          password: formData.password,
          userName: formData.userName,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.()
          // Reset form
          setFormData({
            email: "",
            password: "",
            userName: "",
          })
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Usuario</CardTitle>
        <CardDescription>Ingrese los datos del nuevo usuario</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Nombre de Usuario</Label>
            <Input
              id="userName"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="nombre_usuario"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
