import { User } from '@/types/user.ts'

export interface Organization {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  name: string
  address: string
  phone: string
  email: string
  users: User[]
}
