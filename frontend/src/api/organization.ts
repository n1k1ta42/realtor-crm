import { instance } from '@/api/instance.ts'
import { Organization } from '@/types/organization.ts'

export const organization = {
  getList: async (params: {
    limit: number
    offset: number
    orderBy?: string
    direction?: string
  }): Promise<{ organizations: Organization[]; count: number }> => {
    const response = await instance.get('/organization/list', {
      params,
    })

    return response.data
  },

  getById: async (id: string): Promise<Organization> => {
    const response = await instance.get(`/organization/${id}`)

    return response.data
  },

  create: async (body: {
    name: string
    address: string
    email: string
    phone: string
  }): Promise<string> => {
    const response = await instance.post('/organization', body)

    return response.data
  },
}
