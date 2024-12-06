import { api } from '@/api'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Label } from '@/components/ui/label.tsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'
import { Separator } from '@/components/ui/separator.tsx'
import { Organization } from '@/types/organization.ts'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { AxiosError } from 'axios'
import { clsx } from 'clsx'
import { CopyIcon, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useCopyToClipboard } from 'usehooks-ts'
import { z } from 'zod'

const formSchema = z.object({
  name: z
    .string({
      required_error: 'Введите имя',
    })
    .min(1, {
      message: 'Обязательное поле',
    })
    .trim(),
  surname: z
    .string({
      required_error: 'Введите фамилию',
    })
    .min(1, {
      message: 'Обязательное поле',
    })
    .trim(),
  email: z
    .string({
      required_error: 'Введите email',
    })
    .email({
      message: 'Введите корректный email',
    }),
  role: z
    .string({
      required_error: 'Введите имя',
    })
    .min(1, {
      message: 'Обязательное поле',
    })
    .trim(),
  organizationId: z
    .number({
      required_error: 'Выберите организацию',
    })
    .finite({
      message: 'Выберите организацию',
    }),
})

type Role = z.infer<typeof formSchema>['role']

type Form = z.infer<typeof formSchema>

type Props = {
  organizations: Organization[]
}

export const AddUser = ({ organizations }: Props) => {
  const [password, setPassword] = useState('')
  const [, copy] = useCopyToClipboard()

  const saveUserMutation = useMutation({
    mutationFn: async (value: Form) => {
      return api.user.create(value)
    },
    onSuccess: data => {
      setPassword(data)
      toast.success('Пользователь успешно создан')
    },
    onError: error => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data)
        return
      }
      toast.error('Что то пошло не так на сервере')
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      role: '',
      organizationId: Infinity,
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmitAsync: formSchema,
    },
    onSubmit: async ({ value }) => {
      await saveUserMutation.mutateAsync(value)
      form.reset()
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Добавить пользователя
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Созадние пользователя</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          className='space-y-4'
          onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className='space-y-4'>
            <form.Field
              name='name'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Имя:</Label>
                    <Input
                      className={clsx({
                        ['border-destructive']: field.state.meta.errors.length,
                      })}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
            <form.Field
              name='surname'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Фамилия:</Label>
                    <Input
                      className={clsx({
                        ['border-destructive']: field.state.meta.errors.length,
                      })}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
            <form.Field
              name='email'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Email:</Label>
                    <Input
                      className={clsx({
                        ['border-destructive']: field.state.meta.errors.length,
                      })}
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                    />
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
            <form.Field
              name='role'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Роль:</Label>
                    <Select
                      value={field.state.value || ''}
                      onValueChange={value => field.handleChange(value as Role)}
                    >
                      <SelectTrigger
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        className={clsx({
                          ['border-destructive']:
                            field.state.meta.errors.length,
                        })}
                      >
                        <SelectValue aria-label='Выберите роль' />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { key: 'admin', value: 'Администратор' },
                          { key: 'director', value: 'Директор' },
                          { key: 'worker', value: 'Работник' },
                        ].map(item => (
                          <SelectItem key={item.key} value={`${item.key}`}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
            <form.Field
              name='organizationId'
              children={field => {
                return (
                  <div className='space-y-1'>
                    <Label htmlFor={field.name}>Организация:</Label>
                    <Select
                      value={field.state.value?.toString() || ''}
                      onValueChange={value => field.handleChange(+value)}
                    >
                      <SelectTrigger
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        className={clsx({
                          ['border-destructive']:
                            field.state.meta.errors.length,
                        })}
                      >
                        <SelectValue aria-label='Выберите организация' />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map(o => (
                          <SelectItem key={o.ID} value={`${o.ID}`}>
                            {o.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.errors.length ? (
                      <em className='text-xs text-destructive'>
                        {field.state.meta.errors.join(',')}
                      </em>
                    ) : null}
                  </div>
                )
              }}
            />
          </div>
          {password && (
            <>
              <Separator />
              <div>
                <p className='text-xs'>
                  Для пользователя создан случайный пароль.
                </p>
                <p className='text-xs'>
                  Скопируйте и передайте его пользователю
                </p>
              </div>
              <div className='flex items-center space-x-2 text-sm'>
                <span>Пароль пользователя: </span>
                <span className='font-bold'>{password}</span>
                <span
                  className='cursor-pointer'
                  onClick={() => {
                    copy(password)
                      .then(() =>
                        toast.success('Пароль скопирован в буфер обмена'),
                      )
                      .catch(() =>
                        toast.error('Что то пошло не так при копировании'),
                      )
                  }}
                >
                  <CopyIcon
                    className='hover:text-primary'
                    width={16}
                    height={16}
                  />
                </span>
              </div>
              <Separator />
            </>
          )}
          <form.Subscribe
            selector={state => [state.isFormValid, state.isSubmitting]}
            children={([isValid, isSubmitting]) => (
              <div className='flex items-center justify-end space-x-4'>
                <Button type='submit' disabled={isValid && isSubmitting}>
                  {isValid && isSubmitting ? '...' : 'Создать'}
                </Button>
                <DialogClose asChild>
                  <Button
                    variant='secondary'
                    type='button'
                    onClick={() => {
                      setPassword('')
                      form.reset()
                    }}
                  >
                    Закрыть
                  </Button>
                </DialogClose>
              </div>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
