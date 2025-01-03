'use client'

import { useAuth } from '@/auth.tsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { profileQueryOptions } from '@/queryOptions/profileQueryOptions.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { Bell, ChevronsUpDown, LogOut } from 'lucide-react'

export function NavUser() {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const profile = useSuspenseQuery(profileQueryOptions).data

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  className='object-cover'
                  src={profile.avatar}
                  alt={`${profile.name} ${profile.surname}`}
                />
                <AvatarFallback className='rounded-lg'>
                  {profile.name[0].toLocaleUpperCase()}
                  {profile.surname[0].toLocaleUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{profile.name}</span>
                <span className='truncate text-xs'>{profile.surname}</span>
              </div>
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                <Avatar className='h-8 w-8 rounded-lg'>
                  <AvatarImage
                    className='object-cover'
                    src={profile.avatar}
                    alt={`${profile.name} ${profile.surname}`}
                  />
                  <AvatarFallback className='rounded-lg'>
                    {profile.name[0].toLocaleUpperCase()}
                    {profile.surname[0].toLocaleUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    {profile.name} {profile.surname}
                  </span>
                  <span className='truncate text-xs'>{profile.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Bell />
                Уведомления
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                logout()
                await navigate({
                  to: '/login',
                  search: {
                    redirect: window.location.pathname,
                  },
                })
              }}
            >
              <LogOut />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
