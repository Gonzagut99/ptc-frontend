"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, setAuthUser } from "@/lib/mock-auth"
import Image from "next/image"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    const user = login(username, password)

    if (user) {
      setAuthUser(user)
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas. Use cualquier usuario con contraseña: admin123")
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-6">
          <Image src="/images/ptc-logo.png" alt="PTC Logo" width={180} height={60} className="object-contain" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">Ingrese su usuario y contraseña</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground">
            Usuario
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Ingrese su usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        Demo: Use cualquier usuario con contraseña <strong>admin123</strong>
      </p>
    </div>
  )
}
