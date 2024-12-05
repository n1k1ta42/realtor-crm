import { auth } from '@/api/auth.ts'
import { organization } from '@/api/organization.ts'
import { user } from '@/api/user.ts'

export const api = {
  user,
  auth,
  organization,
}
