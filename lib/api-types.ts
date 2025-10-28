export interface DUser {
  id?: number
  isActive?: boolean
  createdDate?: string
  updatedDate?: string
  userName?: string
  email?: string
  passwordHash?: string
}

export interface DStaff {
  id?: number
  isActive?: boolean
  createdDate?: string
  updatedDate?: string
  phoneNumber?: string
  salary?: number
  currency?: "PEN" | "USD"
  hireDate?: string
  role?: "SALES" | "COUNTER" | "ACCOUNTING" | "OPERATIONS" | "SUPERADMIN" | "SUPPORT"
  userId?: number
  user?: DUser
}

export interface DCustomer {
  id?: number
  isActive?: boolean
  createdDate?: string
  updatedDate?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  birthDate?: string
  idDocumentType?: "PASSPORT" | "DNI" | "DRIVER_LICENSE" | "RUC" | "CE"
  idDocumentNumber?: string
  address?: string
  nationality?: string
}

export interface LiquidationWithDetailsDto {
  id?: number
  customer_id?: number
  staff_id?: number
  customer?: DCustomer
  staff_on_charge?: DStaff
  currency_rate?: number
  total_amount?: number
  payment_deadline?: string
  companion?: number
  status?: "IN_QUOTE" | "PENDING" | "ON_COURSE" | "COMPLETED"
  payment_status?: "PENDING" | "ON_COURSE" | "COMPLETED"
  created_at?: string
  updated_at?: string
}

export interface PageMetadata {
  size?: number
  number?: number
  totalElements?: number
  totalPages?: number
}

export interface PagedResponse<T> {
  content?: T[]
  page?: PageMetadata
}
