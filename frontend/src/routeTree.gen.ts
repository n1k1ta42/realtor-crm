/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthUsersUserIdImport } from './routes/_auth/users.$userId'

// Create Virtual Routes

const AuthUsersIndexLazyImport = createFileRoute('/_auth/users/')()
const AuthProfileIndexLazyImport = createFileRoute('/_auth/profile/')()
const AuthOrganizationsIndexLazyImport = createFileRoute(
  '/_auth/organizations/',
)()
const AuthObjectsIndexLazyImport = createFileRoute('/_auth/objects/')()
const AuthDealsIndexLazyImport = createFileRoute('/_auth/deals/')()
const AuthClientsIndexLazyImport = createFileRoute('/_auth/clients/')()

// Create/Update Routes

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthUsersIndexLazyRoute = AuthUsersIndexLazyImport.update({
  id: '/users/',
  path: '/users/',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/users.index.lazy').then((d) => d.Route),
)

const AuthProfileIndexLazyRoute = AuthProfileIndexLazyImport.update({
  id: '/profile/',
  path: '/profile/',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/profile.index.lazy').then((d) => d.Route),
)

const AuthOrganizationsIndexLazyRoute = AuthOrganizationsIndexLazyImport.update(
  {
    id: '/organizations/',
    path: '/organizations/',
    getParentRoute: () => AuthRoute,
  } as any,
).lazy(() =>
  import('./routes/_auth/organizations.index.lazy').then((d) => d.Route),
)

const AuthObjectsIndexLazyRoute = AuthObjectsIndexLazyImport.update({
  id: '/objects/',
  path: '/objects/',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/objects.index.lazy').then((d) => d.Route),
)

const AuthDealsIndexLazyRoute = AuthDealsIndexLazyImport.update({
  id: '/deals/',
  path: '/deals/',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/deals.index.lazy').then((d) => d.Route),
)

const AuthClientsIndexLazyRoute = AuthClientsIndexLazyImport.update({
  id: '/clients/',
  path: '/clients/',
  getParentRoute: () => AuthRoute,
} as any).lazy(() =>
  import('./routes/_auth/clients.index.lazy').then((d) => d.Route),
)

const AuthUsersUserIdRoute = AuthUsersUserIdImport.update({
  id: '/users/$userId',
  path: '/users/$userId',
  getParentRoute: () => AuthRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/users/$userId': {
      id: '/_auth/users/$userId'
      path: '/users/$userId'
      fullPath: '/users/$userId'
      preLoaderRoute: typeof AuthUsersUserIdImport
      parentRoute: typeof AuthImport
    }
    '/_auth/clients/': {
      id: '/_auth/clients/'
      path: '/clients'
      fullPath: '/clients'
      preLoaderRoute: typeof AuthClientsIndexLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/deals/': {
      id: '/_auth/deals/'
      path: '/deals'
      fullPath: '/deals'
      preLoaderRoute: typeof AuthDealsIndexLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/objects/': {
      id: '/_auth/objects/'
      path: '/objects'
      fullPath: '/objects'
      preLoaderRoute: typeof AuthObjectsIndexLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/organizations/': {
      id: '/_auth/organizations/'
      path: '/organizations'
      fullPath: '/organizations'
      preLoaderRoute: typeof AuthOrganizationsIndexLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/profile/': {
      id: '/_auth/profile/'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof AuthProfileIndexLazyImport
      parentRoute: typeof AuthImport
    }
    '/_auth/users/': {
      id: '/_auth/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof AuthUsersIndexLazyImport
      parentRoute: typeof AuthImport
    }
  }
}

// Create and export the route tree

interface AuthRouteChildren {
  AuthUsersUserIdRoute: typeof AuthUsersUserIdRoute
  AuthClientsIndexLazyRoute: typeof AuthClientsIndexLazyRoute
  AuthDealsIndexLazyRoute: typeof AuthDealsIndexLazyRoute
  AuthObjectsIndexLazyRoute: typeof AuthObjectsIndexLazyRoute
  AuthOrganizationsIndexLazyRoute: typeof AuthOrganizationsIndexLazyRoute
  AuthProfileIndexLazyRoute: typeof AuthProfileIndexLazyRoute
  AuthUsersIndexLazyRoute: typeof AuthUsersIndexLazyRoute
}

const AuthRouteChildren: AuthRouteChildren = {
  AuthUsersUserIdRoute: AuthUsersUserIdRoute,
  AuthClientsIndexLazyRoute: AuthClientsIndexLazyRoute,
  AuthDealsIndexLazyRoute: AuthDealsIndexLazyRoute,
  AuthObjectsIndexLazyRoute: AuthObjectsIndexLazyRoute,
  AuthOrganizationsIndexLazyRoute: AuthOrganizationsIndexLazyRoute,
  AuthProfileIndexLazyRoute: AuthProfileIndexLazyRoute,
  AuthUsersIndexLazyRoute: AuthUsersIndexLazyRoute,
}

const AuthRouteWithChildren = AuthRoute._addFileChildren(AuthRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/users/$userId': typeof AuthUsersUserIdRoute
  '/clients': typeof AuthClientsIndexLazyRoute
  '/deals': typeof AuthDealsIndexLazyRoute
  '/objects': typeof AuthObjectsIndexLazyRoute
  '/organizations': typeof AuthOrganizationsIndexLazyRoute
  '/profile': typeof AuthProfileIndexLazyRoute
  '/users': typeof AuthUsersIndexLazyRoute
}

export interface FileRoutesByTo {
  '': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/users/$userId': typeof AuthUsersUserIdRoute
  '/clients': typeof AuthClientsIndexLazyRoute
  '/deals': typeof AuthDealsIndexLazyRoute
  '/objects': typeof AuthObjectsIndexLazyRoute
  '/organizations': typeof AuthOrganizationsIndexLazyRoute
  '/profile': typeof AuthProfileIndexLazyRoute
  '/users': typeof AuthUsersIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_auth': typeof AuthRouteWithChildren
  '/login': typeof LoginRoute
  '/_auth/users/$userId': typeof AuthUsersUserIdRoute
  '/_auth/clients/': typeof AuthClientsIndexLazyRoute
  '/_auth/deals/': typeof AuthDealsIndexLazyRoute
  '/_auth/objects/': typeof AuthObjectsIndexLazyRoute
  '/_auth/organizations/': typeof AuthOrganizationsIndexLazyRoute
  '/_auth/profile/': typeof AuthProfileIndexLazyRoute
  '/_auth/users/': typeof AuthUsersIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/login'
    | '/users/$userId'
    | '/clients'
    | '/deals'
    | '/objects'
    | '/organizations'
    | '/profile'
    | '/users'
  fileRoutesByTo: FileRoutesByTo
  to:
    | ''
    | '/login'
    | '/users/$userId'
    | '/clients'
    | '/deals'
    | '/objects'
    | '/organizations'
    | '/profile'
    | '/users'
  id:
    | '__root__'
    | '/_auth'
    | '/login'
    | '/_auth/users/$userId'
    | '/_auth/clients/'
    | '/_auth/deals/'
    | '/_auth/objects/'
    | '/_auth/organizations/'
    | '/_auth/profile/'
    | '/_auth/users/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthRoute: typeof AuthRouteWithChildren
  LoginRoute: typeof LoginRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthRoute: AuthRouteWithChildren,
  LoginRoute: LoginRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/login"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/users/$userId",
        "/_auth/clients/",
        "/_auth/deals/",
        "/_auth/objects/",
        "/_auth/organizations/",
        "/_auth/profile/",
        "/_auth/users/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_auth/users/$userId": {
      "filePath": "_auth/users.$userId.tsx",
      "parent": "/_auth"
    },
    "/_auth/clients/": {
      "filePath": "_auth/clients.index.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/deals/": {
      "filePath": "_auth/deals.index.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/objects/": {
      "filePath": "_auth/objects.index.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/organizations/": {
      "filePath": "_auth/organizations.index.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/profile/": {
      "filePath": "_auth/profile.index.lazy.tsx",
      "parent": "/_auth"
    },
    "/_auth/users/": {
      "filePath": "_auth/users.index.lazy.tsx",
      "parent": "/_auth"
    }
  }
}
ROUTE_MANIFEST_END */
