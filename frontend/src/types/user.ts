export interface User {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  email: string
  name: string
  surname: string
  role: string
  avatar: string
  organizationId: number
  clients: string[] | null
  deals: string[] | null
  objects: string[] | null
}
