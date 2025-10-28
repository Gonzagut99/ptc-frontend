import type { DUser, DStaff, DCustomer, LiquidationWithDetailsDto, PagedResponse } from "./api-types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"

// Mock data generators
function generateMockUsers(page: number, size: number): PagedResponse<DUser> {
  const total = 47
  const users: DUser[] = Array.from({ length: Math.min(size, total - page * size) }, (_, i) => ({
    id: page * size + i + 1,
    userName: `user${page * size + i + 1}`,
    email: `user${page * size + i + 1}@ptc.com`,
    isActive: Math.random() > 0.2,
    createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  return {
    content: users,
    page: {
      number: page,
      size: size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    },
  }
}

function generateMockStaff(page: number, size: number): PagedResponse<DStaff> {
  const total = 23
  const roles: DStaff["role"][] = ["SALES", "COUNTER", "ACCOUNTING", "OPERATIONS", "SUPERADMIN", "SUPPORT"]
  const staff: DStaff[] = Array.from({ length: Math.min(size, total - page * size) }, (_, i) => ({
    id: page * size + i + 1,
    phoneNumber: `+51 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
    salary: Math.floor(Math.random() * 3000 + 1500),
    currency: Math.random() > 0.5 ? "PEN" : "USD",
    role: roles[Math.floor(Math.random() * roles.length)],
    isActive: Math.random() > 0.1,
    hireDate: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: page * size + i + 1,
      userName: `staff${page * size + i + 1}`,
      email: `staff${page * size + i + 1}@ptc.com`,
    },
  }))

  return {
    content: staff,
    page: {
      number: page,
      size: size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    },
  }
}

function generateMockCustomers(page: number, size: number): PagedResponse<DCustomer> {
  const total = 156
  const firstNames = ["Juan", "María", "Carlos", "Ana", "Luis", "Carmen", "José", "Rosa", "Pedro", "Isabel"]
  const lastNames = ["García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Sánchez", "Ramírez"]
  const docTypes: DCustomer["idDocumentType"][] = ["DNI", "PASSPORT", "CE", "RUC"]

  const customers: DCustomer[] = Array.from({ length: Math.min(size, total - page * size) }, (_, i) => ({
    id: page * size + i + 1,
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: `customer${page * size + i + 1}@email.com`,
    phoneNumber: `+51 ${Math.floor(Math.random() * 900000000 + 100000000)}`,
    birthDate: new Date(Date.now() - Math.random() * 50 * 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    idDocumentType: docTypes[Math.floor(Math.random() * docTypes.length)],
    idDocumentNumber: `${Math.floor(Math.random() * 90000000 + 10000000)}`,
    nationality: "Peruana",
    isActive: true,
  }))

  return {
    content: customers,
    page: {
      number: page,
      size: size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    },
  }
}

function generateMockLiquidations(page: number, size: number): PagedResponse<LiquidationWithDetailsDto> {
  const total = 89
  const statuses: LiquidationWithDetailsDto["status"][] = ["IN_QUOTE", "PENDING", "ON_COURSE", "COMPLETED"]
  const paymentStatuses: LiquidationWithDetailsDto["payment_status"][] = ["PENDING", "ON_COURSE", "COMPLETED"]

  const liquidations: LiquidationWithDetailsDto[] = Array.from(
    { length: Math.min(size, total - page * size) },
    (_, i) => ({
      id: page * size + i + 1,
      customer_id: Math.floor(Math.random() * 100 + 1),
      staff_id: Math.floor(Math.random() * 20 + 1),
      currency_rate: 3.75 + Math.random() * 0.2,
      total_amount: Math.floor(Math.random() * 5000 + 500),
      payment_deadline: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      companion: Math.floor(Math.random() * 4),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      payment_status: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      customer: {
        id: Math.floor(Math.random() * 100 + 1),
        firstName: "Cliente",
        lastName: `${page * size + i + 1}`,
      },
      staff_on_charge: {
        id: Math.floor(Math.random() * 20 + 1),
        user: {
          userName: `staff${Math.floor(Math.random() * 20 + 1)}`,
        },
      },
    }),
  )

  return {
    content: liquidations,
    page: {
      number: page,
      size: size,
      totalElements: total,
      totalPages: Math.ceil(total / size),
    },
  }
}

// API functions
export async function fetchUsers(page = 0, size = 10): Promise<PagedResponse<DUser>> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return generateMockUsers(page, size)
}

export async function fetchStaff(page = 0, size = 10): Promise<PagedResponse<DStaff>> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return generateMockStaff(page, size)
}

export async function fetchCustomers(page = 0, size = 10): Promise<PagedResponse<DCustomer>> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return generateMockCustomers(page, size)
}

export async function fetchLiquidations(page = 0, size = 10): Promise<PagedResponse<LiquidationWithDetailsDto>> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return generateMockLiquidations(page, size)
}

export const getCustomers = fetchCustomers
export const getStaff = fetchStaff
