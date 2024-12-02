import { instance } from '@/api/instance.ts'

export const user = {
  getProfile: async () => {
    const response = await instance.get('/user/profile')

    return response.data
  },
}
