import { Layout } from '@/components/layout.tsx'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/organizations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Layout links={[{ href: '/organizations', label: 'Организации' }]}></Layout>
  )
}
