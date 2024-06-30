'use client'

import { FormState } from '@/types'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'
import { FormSubmitButton } from '../form-submit-button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'
import { signup } from '../../actions/auth/signup'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import Link from 'next/link'

const initState = { status: 'INIT' } satisfies FormState

export const SignUpForm = () => {
  const [state, action] = useFormState<FormState, FormData>(signup, initState)
  const { toast } = useToast()

  useEffect(() => {
    const hasAuthError = state.status === 'AUTH_ERROR'
    if (!hasAuthError) return
    toast({
      title: state.error.code,
    })
  }, [state, toast])

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required />
              {state.status === 'FORM_ERROR' && <div>{state.errors?.name}</div>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required />
              {state.status === 'FORM_ERROR' && <div>{state.errors?.name}</div>}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            {state.status === 'FORM_ERROR' && <div>{state.errors?.email}</div>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
            {state.status === 'FORM_ERROR' && (
              <div>{state.errors?.password}</div>
            )}
          </div>
          <FormSubmitButton>Sign up</FormSubmitButton>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="#" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
