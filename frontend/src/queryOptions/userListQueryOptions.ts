import { api } from '@/api'
import { queryOptions } from '@tanstack/react-query'

export const userListQueryOptions = (params: {
  limit: number
  offset: number
  orderBy: string
  direction: string
  organizationId?: number
}) =>
  queryOptions({
    queryKey: ['user-list', params],
    queryFn: () => api.user.getList(params),
  })
