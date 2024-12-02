import { api } from '@/api'
import { queryOptions } from '@tanstack/react-query'

export const profileQueryOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: () => api.user.getProfile(),
})
