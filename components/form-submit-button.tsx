import { useFormStatus } from 'react-dom'
import { Button } from './ui/button'
import { ComponentPropsWithoutRef } from 'react'

export const FormSubmitButton = ({
  children,
}: ComponentPropsWithoutRef<'div'>) => {
  const { pending } = useFormStatus()

  return <Button disabled={pending}>{pending ? 'pending...' : children}</Button>
}
