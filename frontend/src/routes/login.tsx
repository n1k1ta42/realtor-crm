import { api } from '@/api'
import { useAuth } from '@/auth.tsx'
import { Button } from '@/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  createFileRoute,
  Link,
  redirect,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

const fallback = '/profile' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  const auth = useAuth()
  const router = useRouter()
  const isLoading = useRouterState({ select: s => s.isLoading })
  const navigate = Route.useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const search = Route.useSearch()

  const onFormSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
    try {
      evt.preventDefault()
      const data = new FormData(evt.currentTarget)
      const emailFieldValue = data.get('email')
      const passwordFieldValue = data.get('password')

      if (!emailFieldValue || !passwordFieldValue) return

      const email = emailFieldValue.toString()
      const password = passwordFieldValue.toString()
      const { token } = await api.auth.login({ email, password })
      auth.setTokenToLS(token)

      setTimeout(async () => {
        await router.invalidate()
        await navigate({ to: search.redirect || fallback })
      }, 0)
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Неверный логин или пароль')
          return
        }
      }
      toast.error('Что то пошло не так на сервере')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoggingIn = isLoading || isSubmitting

  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <Card className='mx-auto max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Аавторизация</CardTitle>
          <CardDescription>
            Введите свой email и пароль для входа
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='grid gap-4' onSubmit={onFormSubmit}>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                disabled={isLoggingIn}
                id='email'
                name='email'
                type='email'
                placeholder='m@example.ru'
                autoComplete='email'
                required
              />
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center'>
                <Label htmlFor='password'>Пароль</Label>
                <Link
                  href='#'
                  className='ml-auto inline-block text-sm underline'
                >
                  Забыли пароль?
                </Link>
              </div>
              <Input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
              />
            </div>
            <Button type='submit' className='w-full'>
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
