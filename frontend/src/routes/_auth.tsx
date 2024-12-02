import { useAuth } from '@/auth.tsx'
import { profileQueryOptions } from '@/queryOptions/profileQueryOptions.ts'
import {
  createFileRoute,
  ErrorComponent,
  ErrorComponentProps,
  Navigate,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { AxiosError } from 'axios'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  errorComponent: AuthErrorComponent,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(profileQueryOptions),
})

function AuthErrorComponent({ error }: ErrorComponentProps) {
  const { logout } = useAuth()

  if (error instanceof AxiosError && error.response?.status === 401) {
    logout()

    return (
      <Navigate
        to={'/login'}
        search={{
          redirect: window.location.pathname,
        }}
      />
    )
  }

  return <ErrorComponent error={error} />
}

function AuthLayout() {
  return <Outlet />
}
