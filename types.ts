import { AuthError } from '@supabase/supabase-js'

export type FormState =
  | { status: 'INIT' }
  | { status: 'FORM_ERROR'; errors?: Record<string, string[]> }
  | { status: 'AUTH_ERROR'; error: AuthError }
  | { status: 'API_ERROR'; error: Error }
  | { status: 'SUCCESS' }
