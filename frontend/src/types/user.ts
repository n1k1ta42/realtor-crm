export interface User {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  email: string
  name: string
  surname: string
  role: string
  organizationId: number
  clients: Array<string> | null
  deals: Array<string> | null
  objects: Array<string> | null
}
