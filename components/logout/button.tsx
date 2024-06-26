'use client'

import { FormSubmitButton } from '../form-submit-button'
import { logout } from './actions'

export const LogoutButton = () => {
  return (
    <form action={logout}>
      <FormSubmitButton>Logout</FormSubmitButton>
    </form>
  )
}
