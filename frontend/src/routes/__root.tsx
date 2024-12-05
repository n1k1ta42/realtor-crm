import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import type { AuthContext } from '../auth'

interface MyRouterContext {
  auth: AuthContext
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' initialIsOpen={false} />
    </>
  ),
  notFoundComponent: () => (
    <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center'>
      <div className='text-9xl'>404</div>
      <Link className='text-primary underline' to='/'>
        На главную
      </Link>
    </div>
  ),
})
