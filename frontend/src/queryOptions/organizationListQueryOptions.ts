import { api } from '@/api'
import { queryOptions } from '@tanstack/react-query'

export const organizationListQueryOptions = (params: {
  limit: number
  offset: number
  orderBy?: string
  direction?: string
}) =>
  queryOptions({
    queryKey: ['organization-list', params],
    queryFn: () => api.organization.getList(params),
  })
