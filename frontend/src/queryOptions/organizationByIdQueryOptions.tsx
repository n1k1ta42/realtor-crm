import { api } from '@/api'
import { queryOptions } from '@tanstack/react-query'

export const organizationByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['organization-by-id', id],
    queryFn: () => api.organization.getById(id),
  })
