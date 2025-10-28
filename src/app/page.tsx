import { LoginForm } from "@/components/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background">
        <LoginForm />
      </div>

      {/* Right Column - Hero Image */}
      <div className="hidden lg:block relative">
        <Image src="/images/login-hero.png" alt="PTC Travel Agency" fill className="object-cover" priority />
      </div>
    </div>
  )
}
