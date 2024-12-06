import { api } from '@/api'
import { queryOptions } from '@tanstack/react-query'

export const userByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['user-by-id', id],
    queryFn: () => api.user.getById(id),
  })
