import { instance } from '@/api/instance.ts'
import { User } from '@/types/user.ts'

export const user = {
  getProfile: async (): Promise<User> => {
    const response = await instance.get('/user/profile')

    return response.data
  },

  getList: async (params: {
    limit: number
    offset: number
    orderBy: string
    direction: string
    organizationId?: number
  }): Promise<{ users: User[]; count: number }> => {
    const response = await instance.get('/user/list', {
      params,
    })

    return response.data
  },

  getById: async (id: string): Promise<User> => {
    const response = await instance.get(`/user/${id}`)

    return response.data
  },

  create: async (body: {
    name: string
    surname: string
    email: string
    role: string
    organizationId: number
  }): Promise<string> => {
    const response = await instance.post('/user', body)

    return response.data
  },

  edit: async (
    id: number,
    body: {
      name?: string
      surname?: string
      email?: string
    },
  ): Promise<string> => {
    const response = await instance.patch(`/user/${id}`, body)

    return response.data
  },

  update: async (
    id: number,
    body: {
      name: string
      surname: string
      email: string
      avatar: string
    },
  ): Promise<User> => instance.patch(`/user/${id}`, body),

  delete: async (id: number): Promise<void> => instance.delete(`/user/${id}`),
}
