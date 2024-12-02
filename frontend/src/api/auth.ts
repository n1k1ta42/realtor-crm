import { instance } from '@/api/instance.ts'

export const auth = {
  login: async (body: {
    email: string
    password: string
  }): Promise<{ token: string }> => {
    const response = await instance.post('/auth/login', body)

    return response.data
  },
}
