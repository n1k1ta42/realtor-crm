import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

import { AuthProvider, useAuth } from './auth'
import { routeTree } from './routeTree.gen'

import './index.css'

import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const queryClient = new QueryClient()

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: {
    auth: undefined!,
    queryClient,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth }} />
      <Toaster />
    </QueryClientProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme='dark' storageKey='app-ui-theme'>
        <InnerApp />
      </ThemeProvider>
    </AuthProvider>
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
