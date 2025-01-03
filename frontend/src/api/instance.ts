import { KEY } from '@/auth.tsx'
import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL

export const instance = axios.create({
  baseURL: API_URL,
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem(KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
