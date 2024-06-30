import { Dashboard } from '@/components/dashboard'
import { Landing } from '@/components/landing'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return <Dashboard />
  }

  return <Landing />
}
