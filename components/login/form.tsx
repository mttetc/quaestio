'use client'

import { FormState } from '@/types'
import Link from 'next/link'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { login } from '../../actions/auth/login'
import { FormSubmitButton } from '../form-submit-button'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'

const initState = { status: 'INIT' } satisfies FormState

export const LoginForm = () => {
  const [state, action] = useFormState<FormState, FormData>(login, initState)
  const { toast } = useToast()

  useEffect(() => {
    const { status } = state

    if (status === 'INIT') return

    if (state.status === 'AUTH_ERROR') {
      toast({
        title: state.error.code,
      })
    }
  }, [state, toast])

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />
            {state.status === 'FORM_ERROR' && <div>{state.errors?.email}</div>}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm underline">
                Forgot your password?
              </Link>
            </div>
            <Input id="password" type="password" required name="password" />
            {state.status === 'FORM_ERROR' && (
              <div>{state.errors?.password}</div>
            )}
          </div>
          <FormSubmitButton>Login</FormSubmitButton>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="#" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
