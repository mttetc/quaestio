import { createClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseURL } from './config'

export const supabaseClient = createClient(supabaseURL, supabaseAnonKey)
