import Link from 'next/link'
import { Button } from './ui/button'

export function Landing() {
  return (
    <>
      <Link href="/signup" passHref>
        <Button>Sign up</Button>
      </Link>
      <Link href="/login" passHref>
        <Button>Login</Button>
      </Link>
    </>
  )
}
