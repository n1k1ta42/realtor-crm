import { NavAdmin } from '@/components/nav-admin.tsx'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { profileQueryOptions } from '@/queryOptions/profileQueryOptions.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  AudioWaveform,
  Building,
  Building2,
  Command,
  GalleryVerticalEnd,
  Handshake,
  Heart,
  Users,
} from 'lucide-react'
import * as React from 'react'

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Клиенты',
      url: '/clients',
      icon: Heart,
      isActive: true,
      items: [
        {
          title: 'Список клиентов',
          url: '/clients',
        },
      ],
    },
    {
      title: 'Объекты',
      url: '/objects',
      icon: Building2,
      isActive: true,
      items: [
        {
          title: 'Список объектов',
          url: '/objects',
        },
      ],
    },
    {
      title: 'Сделки',
      url: '/deals',
      icon: Handshake,
      isActive: true,
      items: [
        {
          title: 'Список сделок',
          url: '/deals',
        },
      ],
    },
  ],
  navAdmin: [
    {
      name: 'Пользователи',
      url: '/users',
      icon: Users,
    },
    {
      name: 'Организации',
      url: '/organizations',
      icon: Building,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const profile = useSuspenseQuery(profileQueryOptions).data

  const isAdmin = profile?.role === 'admin'

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        {isAdmin && <TeamSwitcher teams={data.teams} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {isAdmin && <NavAdmin projects={data.navAdmin} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
