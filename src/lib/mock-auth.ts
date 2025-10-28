export interface AuthUser {
  id: number
  userName: string
  email: string
  role: string
}

const MOCK_USER: AuthUser = {
  id: 1,
  userName: "admin",
  email: "admin@ptc.com",
  role: "SUPERADMIN",
}

export function login(username: string, password: string): AuthUser | null {
  // Mock login - accepts any username with password "admin123"
  if (password === "admin123") {
    return { ...MOCK_USER, userName: username }
  }
  return null
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ptc_auth_user")
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("ptc_auth_user")
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export function setAuthUser(user: AuthUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("ptc_auth_user", JSON.stringify(user))
  }
}
