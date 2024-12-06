import { api } from '@/api'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useNavigate } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  id: number
}

export const DeleteUser = ({ id }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async () => {
    toast.promise(api.user.delete(id), {
      loading: 'Удаление пользователя',
      success: 'Пользователь успешно удален',
      error: 'Что-то пошло не так',
    })
    setIsOpen(false)
    navigate({
      to: '/users',
      search: {
        offset: 0,
        limit: 25,
        orderBy: 'id',
        direction: 'asc',
      },
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button size='sm' variant='destructive'>
          <XIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Вы уверены что хотите удалить пользователя?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя будет отменить. Мы используем безопастное
            удаление данных. Данные пользователя буду сохранены после удаление,
            но они будут не видны.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <div className='flex items-center justify-end space-x-4'>
            <Button variant='destructive' onClick={handleDelete}>
              Удалить
            </Button>
            <AlertDialogCancel>Отменить</AlertDialogCancel>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
