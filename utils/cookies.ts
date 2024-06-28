export const getCookie = (name: string) => {
  if (typeof window === 'undefined') return

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const deleteCookie = (name: string) => {
  if (typeof window === 'undefined') return

  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}
