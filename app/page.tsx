import { LogoutButton } from '@/components/logout/button'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  console.log('🚀 ~ Home ~ user:', user)

  if (user) {
    return (
      <div>
        <h1>Home</h1>
        <p>{user.email}</p>
        <LogoutButton />
      </div>
    )
  }

  return (
    <div>
      Home
      <Link href="/signup" passHref>
        <Button>Sign up</Button>
      </Link>
      <Link href="/login" passHref>
        <Button>Login</Button>
      </Link>
    </div>
  )
}
